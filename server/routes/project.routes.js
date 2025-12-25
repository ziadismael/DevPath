import { Router } from 'express';
import {
    createProject,
    getAllProjects,
    getMyProjects,
    getProjectById,
    updateProject,
    deleteProject
} from '../controllers/project.controller.js';
import { authorize } from "../middlewares/auth.middleware.js";

const projectRouter = Router();

// --- Public Routes ---
// Anyone can browse all projects
projectRouter.get('/', getAllProjects);

// --- Protected Routes (Require User to be Logged In) ---
// IMPORTANT: This route must come BEFORE /:projectID to avoid route conflicts
// Get logged-in user's projects (where they are a team member)
projectRouter.get('/my/projects', authorize, getMyProjects);

// --- Public Routes (continued) ---
// Anyone can view a single project by its ID
projectRouter.get('/:projectID', getProjectById);

// --- Protected Routes (continued) ---
// A logged-in user can create a new project
projectRouter.post('/', authorize, createProject);
// A logged-in user can update their own project
projectRouter.put('/:projectID', authorize, updateProject);
// A logged-in user can delete their own project
projectRouter.delete('/:projectID', authorize, deleteProject);


export default projectRouter;
