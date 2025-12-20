import apiClient from './client';
import { LoginRequest, SignupRequest, AuthResponse } from '../types';
import { storage } from '../utils/storage';

export const authAPI = {
    // Sign up new user
    async signup(data: SignupRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/signup', data);
        // Store token and user data
        storage.setToken(response.data.token);
        storage.setUser(response.data.user);
        return response.data;
    },

    // Login user
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/signin', data);
        // Store token and user data
        storage.setToken(response.data.token);
        storage.setUser(response.data.user);
        return response.data;
    },

    // Logout user
    async logout(): Promise<void> {
        try {
            await apiClient.post('/auth/signout');
        } finally {
            // Clear local storage regardless of API response
            storage.clearAuth();
        }
    },
};
