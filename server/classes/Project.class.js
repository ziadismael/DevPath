import {models} from "../models/index.models.js";

class Project {
    constructor(projectName) {
        this._projectID = null;
        this._projectName = projectName;
        this._githubRepo = null;
    }

    async saveToDB(){
        const newProject = await models.Project.create({
            projectName: this.projectName,
            gitHubRepo: this._githubRepo,
        });
        console.log("Project has been saved to DB: ",newProject);
        this._projectID = newProject.projectName;
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
}


export default Project;