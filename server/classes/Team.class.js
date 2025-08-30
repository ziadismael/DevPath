import {models} from "../models/index.models.js";

class TeamClass {
    constructor(teamName) {
        this._teamName = teamName;
        this._teamID = null;
        this._teamMembers = [];
        this._projects = [];
    }

    async saveToDB() {
        const newTeam = await models.Team.create({
            teamName: this._teamName
        });
        this._teamID = newTeam.teamID;
    }

    async loadRelations() {
        const team = await models.Team.findByPk(this._teamID, {
            include: [models.User, models.Project]
        });
        this._teamMembers = team.Users;
        this._projects = team.Projects;
    }


    async addMember(userID){
        const team = await models.Team.findByPk(this._teamID);
        const user = await models.User.findByPk(userID);

        if (!user || !team) {
            throw new Error("Cannot add user: userID / teamID is invalid.");
        }
        await team.addUser(user);
        this._teamMembers.push(user);
    }

    async assignProject(projectInstance){
        await projectInstance.setTeam(this._teamID);
        await projectInstance.saveUpdates();
        this._projects.push(projectInstance);
    }

    setTeamName(teamName) {
        if (typeof(teamName) !== "string") {
            throw new Error("Team name must be a string");
        }
        this._teamName = teamName;
    }

    getTeamName() {
        return this._teamName;
    }

    getTeamID() {
        return this._teamID;
    }
}

export default TeamClass;