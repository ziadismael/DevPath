import { Router } from 'express';
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
} from '../controllers/project.controller.js';
import { authorize } from "../middlewares/auth.middleware.js";

const projectRouter = Router();

// --- Public Routes ---
// Anyone can browse all projects
projectRouter.get('/', getAllProjects);
// Anyone can view a single project by its ID
projectRouter.get('/:projectID', getProjectById);


// --- Protected Routes (Require User to be Logged In) ---
// A logged-in user can create a new project
projectRouter.post('/', authorize, createProject);
// A logged-in user can update their own project
projectRouter.put('/:projectID', authorize, updateProject);
// A logged-in user can delete their own project
projectRouter.delete('/:projectID', authorize, deleteProject);


export default projectRouter;
