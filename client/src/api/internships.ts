import apiClient from './client';
import { Internship } from '../types';

export const internshipsAPI = {
    // Get all internships with optional filters
    async getInternships(params?: {
        search?: string;
        type?: string;
        location?: string;
    }): Promise<Internship[]> {
        const response = await apiClient.get<Internship[]>('/internships', { params });
        return response.data;
    },

    // Get single internship by ID
    async getInternship(id: number): Promise<Internship> {
        const response = await apiClient.get<Internship>(`/internships/${id}`);
        return response.data;
    },

    // Apply to internship (requires authentication)
    async applyToInternship(id: number, applicationData?: any): Promise<any> {
        const response = await apiClient.post(`/internships/${id}/apply`, applicationData);
        return response.data;
    },
};
