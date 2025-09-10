import {models} from "../models/index.models.js";

class ProjectClass {
    constructor(projectData) {
        this._projectID = null;
        this._projectName = projectData.projectName;
        this._githubRepo = projectData.gitHubRepo || null;
        this._teamID = projectData.teamID || null;
        this._projectID = projectData.projectID || null;
        this.description = projectData.description || null;
        this.liveDemoURL = projectData.liveDemoURL || null;
        this.techStack = projectData.techStack || [];
        this.screenshots = projectData.screenshots || [];
    }

    static async findById(projectID) {
        const projectRecord = await models.Project.findByPk(projectID);
        return projectRecord ? new ProjectClass(projectRecord.toJSON()) : null;
    }

    static async findAll() {
        const projectRecords = await models.Project.findAll({
            order: [['createdAt', 'DESC']],
            include: {
                model: models.Team,
                include: {
                    model: models.User,
                    attributes: ['userID', 'username']
                }
            }
        });
        return projectRecords.map(record => new ProjectClass(record.toJSON()));
    }


     // * Creates a project for a specific, existing team.
     // * Includes authorization to ensure the user is a member of the team.
    static async createForTeam(projectData, user, userRecord) {
        if (!projectData.teamID) {
            throw new Error("A teamID must be provided to create a team project.");
        }
        const team = await models.Team.findByPk(projectData.teamID);
        if (!team) {
            throw new Error(`Team with ID ${projectData.teamID} not found.`);
        }

        const memberRecord = await models.TeamMember.findOne({
            where: {
                teamID: team.teamID,
                userID: user.userID
            }
        });
        if (!memberRecord) {
            throw new Error(`You are not authorized to add a project to this team.`);
        }

        return ProjectClass.#createRecord(projectData, team.teamID);
    }

     // * Creates a project for a user's personal team.
     // * It will find or create the personal team automatically.
    static async createPersonal(projectData, user, userRecord) {
        let personalTeam = await models.Team.findOne({
            where: { isPersonal: true },
            include: { model: models.User, where: { userID: user.userID } }
        });

        if (!personalTeam) {
            personalTeam = await models.Team.create({
                teamName: `${user.getUsername()}'s Personal Projects`,
                isPersonal: true,
            });
            await personalTeam.addUser(userRecord, { through: { role: 'Owner' } });
        }

        return await ProjectClass.#createRecord(projectData, personalTeam.teamID);
    }

    static async #createRecord(projectData, teamID) {
        const newProjectRecord = await models.Project.create({
            projectName: projectData.projectName,
            description: projectData.description,
            gitHubRepo: projectData.gitHubRepo,
            liveDemoURL: projectData.liveDemoURL,
            screenshots: projectData.screenshots,
            techStack: projectData.techStack,
            teamID: teamID,
        });

        if (!newProjectRecord) {
            throw new Error("Failed to create project in the database.");
        }

        return new ProjectClass(newProjectRecord.toJSON());
    }

    async saveToDB(){
        const newProject = await models.Project.create({
            teamID: this._teamID,
            projectName: this._projectName,
            gitHubRepo: this._gitHubRepo,
            description: this.description,
            liveDemoURL: this.liveDemoURL,
            screenshots: this.screenshots,
            techStack: this.techStack,
        });
        console.log("Project has been saved to DB: ",newProject);
        this._projectID = newProject.projectID;
    }

    async saveUpdates() {
        const projectRecord = await models.Project.findByPk(this._projectID);
        if (!projectRecord) {
            throw new Error(`Project with ID ${this._projectID} not found`);
        }
        projectRecord.projectName = this._projectName;
        projectRecord.description = this.description;
        projectRecord.gitHubRepo = this._githubRepo;
        projectRecord.liveDemoURL = this.liveDemoURL;
        projectRecord.screenshots = this.screenshots;
        projectRecord.techStack = this.techStack;
        await projectRecord.save();
    }

    async deleteProject() {
        if (!this._projectID) {
            throw new Error(`Cannot delete: project ${this._projectID} not persisted in DB`);
        }

        await models.Project.destroy({
            where: { projectID: this._projectID }
        });

        // Optional: clear local state
        this._projectID = null;
    }

    async isTeamMember(user) {
        const team = await models.Team.findByPk(this._teamID, {
            include: {
                model: models.User,
                where: { userID: user.userID }
            }
        });
        return !!team;
    }

    setProjectName(projectName) {
        if (typeof projectName !== "string"){
            throw new Error("Project name must be a string.");
        }
        this.projectName = projectName;
    }

    getProjectName() {
        return this._projectName;
    }

    setGitHubRepo(githubRepo) {
        if (typeof githubRepo !== "string"){
            throw new Error("GitHub repo must be a string.");
        }
        this._githubRepo = githubRepo;
    }

    getGitHubRepo() {
        return this._githubRepo;
    }

    getProjectID(){
        return this._projectID;
    }

    getTeamID() {
        return this._teamID;
    }

    async setTeam(teamID) {
        const team = await models.Team.findByPk(teamID);
        if (!team){
            throw new Error("Cannot find team with the teamID: " + teamID);
        }
        this._teamID = teamID;
        await this.saveUpdates()
    }
}


export default ProjectClass;