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

        // Fetch the raw project record (not serialized)
        const projectRecord = await models.Project.findByPk(projectID, {
            include: {
                model: models.Team,
                include: {
                    model: models.User,
                    attributes: ['userID', 'username', 'firstName', 'lastName'],
                    through: { attributes: ['role'] }
                }
            }
        });

        if (!projectRecord) {
            const error = new Error("Project not found");
            error.status = 404;
            throw error;
        }

        // Create ProjectClass instance for authorization check
        const project = new ProjectClass(projectRecord.toJSON());

        // --- AUTHORIZATION CHECK ---
        const isAuthorized = await project.isTeamMember(req.user);
        if (!isAuthorized) {
            const error = new Error("You are not authorized to update this project.");
            error.status = 403; // 403 Forbidden
            throw error;
        }

        // Update the database record directly
        projectRecord.projectName = req.body.projectName || projectRecord.projectName;
        projectRecord.description = req.body.description || projectRecord.description;
        projectRecord.gitHubRepo = req.body.gitHubRepo || projectRecord.gitHubRepo;
        projectRecord.liveDemoURL = req.body.liveDemoURL || projectRecord.liveDemoURL;
        projectRecord.screenshots = req.body.screenshots || projectRecord.screenshots;
        projectRecord.techStack = req.body.techStack || projectRecord.techStack;
        await projectRecord.save();

        // Return serialized version
        const updatedProject = new ProjectClass(projectRecord.toJSON());
        res.status(200).json({
            message: `Project updated successfully`,
            data: updatedProject.toJSON(),
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
