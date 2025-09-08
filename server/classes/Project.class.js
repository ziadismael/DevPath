import {models} from "../models/index.models.js";

class ProjectClass {
    constructor(projectName) {
        this._projectID = null;
        this._projectName = projectName;
        this._githubRepo = null;
        this._teamID = null;
    }

    static async findById(projectID) {
        const projectRecord = await models.Project.findByPk(projectID);
        return projectRecord ? ProjectClass._createInstance(projectRecord) : null;
    }

    static _createInstance(projectRecord) {
        const project = new ProjectClass(projectRecord.projectName);
        project._projectID = projectRecord.projectID;
        project._githubRepo = projectRecord.gitHubRepo;
        project._teamID = projectRecord.teamID;
        return project;
    }


    async saveToDB(){
        const newProject = await models.Project.create({
            projectName: this.projectName,
            gitHubRepo: this._githubRepo,
        });
        console.log("Project has been saved to DB: ",newProject);
        this._projectID = newProject.projectID;
    }

    async saveUpdates() {
        const currentProject = await models.Project.findByPk(this._projectID);

        if (!currentProject) {
            throw new Error(`Project with ID ${this._projectID} not found`);
        }

        currentProject.gitHubRepo = this._githubRepo;
        currentProject.projectName = this._projectName;
        currentProject.teamID = this._teamID

        await currentProject.save();
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

    async setProjectName(projectName) {
        if (typeof projectName !== "string"){
            throw new Error("Project name must be a string.");
        }
        this.projectName = projectName;
        await this.saveUpdates();
    }

    getProjectName() {
        return this._projectName;
    }

    async setGitHubRepo(githubRepo) {
        if (typeof githubRepo !== "string"){
            throw new Error("GitHub repo must be a string.");
        }
        this._githubRepo = githubRepo;
        await this.saveUpdates();
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
        await this.saveUpdates();
    }
}


export default ProjectClass;