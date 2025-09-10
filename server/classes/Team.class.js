import {models} from "../models/index.models.js";
import UserClass from "../models/user.class.js";

class TeamClass {
    constructor(teamData) {
        this._teamID = teamData.teamID;
        this._teamName = teamData.teamName;
        this._isPersonal = teamData.isPersonal;
        // Eager-loaded relations can be passed in constructor
        this._members = teamData.Users ? teamData.Users.map(u => new UserClass(u.toJSON())) : [];
    }

    static async create(teamData, user) {
        const newTeamRecord = await models.Team.create({
            teamName: teamData.teamName,
        });

        // Add the creator as the first member with the 'Owner' role
        await newTeamRecord.addUser(user, { through: { role: 'Owner' } });

        return new TeamClass(newTeamRecord.toJSON());
    }

    async saveUpdates() {
        const teamRecord = await models.Team.findByPk(this._teamID);
        teamRecord.teamName = this._teamName;
        await teamRecord.save();
    }

    async destroy() {
        // Add logic to handle projects if necessary (e.g., prevent deletion if projects exist)
        await models.Team.destroy({ where: { teamID: this._teamID } });
    }

     // Finds a team by its primary key, including its members.
    static async findById(teamID) {
        const teamRecord = await models.Team.findByPk(teamID, {
            include: { model: models.User, attributes: ['userID', 'username', 'email'] }
        });
        return teamRecord ? new TeamClass(teamRecord.toJSON()) : null;
    }

     // Finds all teams that a specific user is a member of.
    static async findForUser(user) {
        const teams = await user.getTeams({
            joinTableAttributes: ['role'], // Include the role from the TeamMember table
            include: { model: models.User, attributes: ['userID', 'username'] }
        });
        return teams.map(t => new TeamClass(t.toJSON()));
    }


    async addMember(user, role = 'Contributor') {
        const team = await models.Team.findByPk(this._teamID);

        if (!user || !team) {
            throw new Error("Cannot add user: userID / teamID is invalid.");
        }
        await team.addUser(user, { through: { role } });
    }

    async removeMember(user) {
        const teamRecord = await models.Team.findByPk(this._teamID);
        if (!user || !teamRecord) {
            throw new Error("Cannot add user: userID / teamID is invalid.");
        }
        await teamRecord.removeUser(user);
    };


    async isOwner(user) {
        const member = await models.TeamMember.findOne({
            where: {
                teamID: this._teamID,
                userID: user.userID,
                role: 'Owner'
            }
        });
        return !!member;
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