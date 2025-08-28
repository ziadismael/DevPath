import {models} from "../models/index.models.js";

class ProjectClass {
    constructor(projectName) {
        this._projectID = null;
        this._projectName = projectName;
        this._githubRepo = null;
        this._teamID = null;
    }

    async saveToDB(){
        const newProject = await models.Project.create({
            projectName: this.projectName,
            gitHubRepo: this._githubRepo,
        });
        console.log("Project has been saved to DB: ",newProject);
        this._projectID = newProject.projectName;
    }

    async saveUpdates() {
        const currentProject = await models.Project.findByPk(this._projectID);

        currentProject.gitHubRepo = this._githubRepo;
        currentProject.projectName = this._projectName;
        currentProject.teamID = this._teamID

        await currentProject.save();
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