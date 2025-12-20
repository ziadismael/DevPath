import TeamClass from '../classes/Team.class.js';
import { UserClass } from '../classes/User.class.js';
import { models } from '../models/index.models.js';

export const createTeam = async (req, res, next) => {
    try {
        const team = await TeamClass.create(req.body, req.user, req.userRecord);
        res.status(201).json({
            success: true,
            message: 'Team created successfully.',
            data: team,
        });
    } catch (error) {
        next(error);
    }
};

export const getTeamsForUser = async (req, res, next) => {
    try {
        const teams = await TeamClass.findForUser(req.user);
        res.status(200).json({
            success: true,
            count: teams.length,
            data: teams,
        });
    } catch (error) {
        next(error);
    }
};

export const getTeamById = async (req, res, next) => {
    try {
        const team = await TeamClass.findById(req.params.teamID);
        if (!team) {
            const error = new Error('Team not found');
            error.status = 404;
            throw error;
        }
        res.status(200).json({
            success: true,
            data: team,
        });
    } catch (error) {
        next(error);
    }
};

export const updateTeam = async (req, res, next) => {
    try {
        const team = await TeamClass.findById(req.params.teamID);
        if (!team) {
            const error = new Error('Team not found');
            error.status = 404;
            throw error;
        }

        const isAuthorized = await team.isOwner(req.user);
        if (!isAuthorized) {
            const error = new Error('You are not authorized to update this team.');
            error.status = 403;
            throw error;
        }
        const { teamName } = req.body;
        team.setTeamName(teamName);
        await team.saveUpdates();

        res.status(200).json({
            success: true,
            message: 'Team updated successfully.',
            data: team,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTeam = async (req, res, next) => {
    try {
        const team = await TeamClass.findById(req.params.teamID);
        if (!team) {
            const error = new Error('Team not found');
            error.status = 404;
            throw error;
        }

        const isAuthorized = await team.isOwner(req.user);
        if (!isAuthorized) {
            const error = new Error('You are not authorized to delete this team.');
            error.status = 403;
            throw error;
        }

        await team.destroy();
        res.status(200).json({
            success: true,
            message: 'Team deleted successfully.',
        });
    } catch (error) {
        next(error);
    }
};

export const addTeamMember = async (req, res, next) => {
    try {
        const team = await TeamClass.findById(req.params.teamID);
        if (!team) {
            const error = new Error('Team not found');
            error.status = 404;
            throw error;
        }

        const isAuthorized = await team.isOwner(req.userRecord);
        if (!isAuthorized) {
            const error = new Error('Only team owners can add members.');
            console.log(await team.getMembers());
            error.status = 403;
            throw error;
        }

        const userToAdd = await UserClass.findByUsername(req.body.username);
        const userRecord = await models.User.findByPk(userToAdd.userID);
        if (!userToAdd) {
            const error = new Error('User to add not found.');
            error.status = 404;
            throw error;
        }

        await team.addMember(userToAdd, userRecord, req.body.role);

        res.status(200).json({
            success: true,
            message: `User ${userToAdd.getUsername()} added to the team.`,
        });
    } catch (error) {
        next(error);
    }
};

export const removeTeamMember = async (req, res, next) => {
    try {
        const team = await TeamClass.findById(req.params.teamID);
        if (!team) {
            const error = new Error('Team not found');
            error.status = 404;
            throw error;
        }

        const isAuthorized = await team.isOwner(req.user);
        if (!isAuthorized) {
            const error = new Error('Only team owners can remove members.');
            error.status = 403;
            throw error;
        }

        const userToRemove = await UserClass.findById(req.params.userID);
        const userRecord = await models.User.findByPk(req.params.userID);  // Fixed: use userID not teamID
        if (!userToRemove) {
            const error = new Error('User to remove not found.');
            error.status = 404;
            throw error;
        }

        await team.removeMember(userToRemove, userRecord);

        res.status(200).json({
            success: true,
            message: `User ${userToRemove.getUsername()} removed from the team.`,
        });
    } catch (error) {
        next(error);
    }
};

