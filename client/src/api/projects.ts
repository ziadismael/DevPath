import apiClient from './client';
import { Project } from '../types';

export const projectsAPI = {
    // Get all projects
    async getProjects(): Promise<Project[]> {
        const response = await apiClient.get<Project[]>('/projects');
        return response.data;
    },

    // Get single project by ID
    async getProject(id: number): Promise<Project> {
        const response = await apiClient.get<Project>(`/projects/${id}`);
        return response.data;
    },

    // Create new project (requires authentication)
    async createProject(data: {
        projectName: string;
        description: string;
        techStack?: string[];
        gitHubRepo?: string;
        liveDemoURL?: string;
        screenshots?: string[];
        teamID?: string;
    }): Promise<Project> {
        const response = await apiClient.post<{ data: Project }>('/projects', data);
        return response.data.data || response.data;
    },

    // Update project (requires authentication)
    async updateProject(projectID: string, data: Partial<Project>): Promise<Project> {
        const response = await apiClient.put<{ data: Project }>(`/projects/${projectID}`, data);
        return response.data.data || response.data;
    },

    // Delete project (requires authentication)
    async deleteProject(projectID: string): Promise<void> {
        await apiClient.delete(`/projects/${projectID}`);
    },
};
