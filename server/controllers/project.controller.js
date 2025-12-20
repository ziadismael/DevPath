import ProjectClass from '../classes/Project.class.js';
import { models } from '../models/index.models.js';

export const createProject = async (req, res, next) => {
    try {
        let newProject;
        if (req.body.teamID) {
            newProject = await ProjectClass.createForTeam(req.body, req.user, req.userRecord);
        } else {
            newProject = await ProjectClass.createPersonal(req.body, req.user, req.userRecord);
        }

        res.status(201).json({
            success: true,
            message: `Project '${newProject._projectName}' created successfully.`,
            data: newProject,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllProjects = async (req, res, next) => {
    try {
        const projects = await ProjectClass.findAll();
        res.status(200).json({
            message: `Fetched ${projects.length} projects`,
            data: projects,
        });
    } catch (error) {
        next(error);
    }
};

export const getMyProjects = async (req, res, next) => {
    try {
        // Get all projects where the current user is a team member
        const projectRecords = await models.Project.findAll({
            order: [['createdAt', 'DESC']],
            include: {
                model: models.Team,
                required: true,
                include: {
                    model: models.User,
                    where: { userID: req.user.userID },
                    attributes: ['userID', 'username'],
                    through: { attributes: [] }
                }
            }
        });

        const projects = projectRecords.map(record => new ProjectClass(record.toJSON()));

        res.status(200).json({
            message: `Fetched ${projects.length} user projects`,
            data: projects,
        });
    } catch (error) {
        next(error);
    }
};

export const getProjectById = async (req, res, next) => {
    try {
        const { projectID } = req.params;
        const currentProject = await ProjectClass.findById(projectID);

        if (!currentProject) {
            const error = new Error("Project not found");
            error.status = 404;
            throw error;
        }

        res.status(200).json({
            message: `GET Project with ID: ${projectID}`,
            data: currentProject,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProject = async (req, res, next) => {
    try {
        const { projectID } = req.params;
        const project = await ProjectClass.findById(projectID);

        if (!project) {
            const error = new Error("Project not found");
            error.status = 404;
            throw error;
        }

        // --- AUTHORIZATION CHECK ---
        const isAuthorized = await project.isTeamMember(req.user);
        if (!isAuthorized) {
            const error = new Error("You are not authorized to update this project.");
            error.status = 403; // 403 Forbidden
            throw error;
        }

        project._projectName = req.body.projectName || project._projectName;
        project._description = req.body.description || project._description;
        project._githubRepo = req.body.gitHubRepo || project._githubRepo;
        project._liveDemoURL = req.body.liveDemoURL || project._liveDemoURL;
        project._screenshots = req.body.screenshots || project._screenshots;
        project._techStack = req.body.techStack || project._techStack;
        await project.saveUpdates();

        res.status(200).json({
            message: `Endpoint for updating project with ID: ${projectID}`,
            data: project,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProject = async (req, res, next) => {
    try {
        const { projectID } = req.params;
        const project = await ProjectClass.findById(projectID);

        if (!project) {
            const error = new Error("Project not found");
            error.status = 404;
            throw error;
        }

        // --- AUTHORIZATION CHECK ---
        const isAuthorized = await project.isTeamMember(req.user);
        if (!isAuthorized) {
            const error = new Error("You are not authorized to delete this project.");
            error.status = 403; // 403 Forbidden
            throw error;
        }

        await project.deleteProject();

        res.status(200).json({ message: `Endpoint for deleting project with ID: ${projectID}` });
    } catch (error) {
        next(error);
    }
};
