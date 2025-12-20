import apiClient from './client';
import { User, UpdateProfileRequest } from '../types';

export const usersAPI = {
    // Get current user profile
    async getProfile(): Promise<User> {
        const response = await apiClient.get<User>('/users/profile');
        return response.data;
    },

    // Get user by username
    async getUserByUsername(username: string): Promise<User> {
        const response = await apiClient.get<User>(`/users/${username}`);
        return response.data;
    },

    // Update user profile
    async updateProfile(username: string, data: UpdateProfileRequest): Promise<User> {
        const response = await apiClient.put<User>(`/users/${username}`, data);
        return response.data;
    },

    // Follow user
    async followUser(username: string): Promise<void> {
        await apiClient.post(`/users/${username}/follow`);
    },

    // Unfollow user
    async unfollowUser(username: string): Promise<void> {
        await apiClient.delete(`/users/${username}/unfollow`);
    },

    // Get followers list
    async getFollowers(): Promise<User[]> {
        const response = await apiClient.get<any>('/users/profile');
        return response.data.followers || [];
    },

    // Get following list
    async getFollowing(): Promise<User[]> {
        const response = await apiClient.get<any>('/users/profile');
        return response.data.following || [];
    },
};
