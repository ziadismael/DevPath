import { Router } from 'express';
import { authorize } from '../middlewares/auth.middleware.js';
import {
    createTeam,
    getTeamsForUser,
    getTeamById,
    updateTeam,
    deleteTeam,
    addTeamMember,
    removeTeamMember,
} from '../controllers/team.controller.js';

const teamRouter = Router();

// All team routes require a user to be logged in.
teamRouter.use(authorize);

// --- Core Team CRUD ---
teamRouter.post('/', createTeam);
teamRouter.get('/', getTeamsForUser); // Gets all teams the current user is a member of
teamRouter.get('/:teamID', getTeamById);
teamRouter.put('/:teamID', updateTeam);
teamRouter.delete('/:teamID', deleteTeam);

// --- Team Member Management ---
teamRouter.post('/:teamID/members', addTeamMember);
teamRouter.delete('/:teamID/members/:userID', removeTeamMember);

export default teamRouter;

