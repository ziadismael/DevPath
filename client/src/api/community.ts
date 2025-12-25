import apiClient from './client';
import { Post } from '../types';

export const communityAPI = {
    // Get user + friends feed (requires authentication)
    async getFeed(): Promise<Post[]> {
        const response = await apiClient.get<{ data: Post[] }>('/posts/feed');
        return response.data.data || response.data;
    },

    // Get all posts with optional category filter
    async getPosts(category?: string): Promise<Post[]> {
        const params = category && category !== 'all' ? { category } : {};
        const response = await apiClient.get<{ data: Post[] }>('/posts', { params });
        return response.data.data || response.data;
    },

    // Get single post by ID with comments
    async getPost(postID: string): Promise<Post> {
        const response = await apiClient.get<{ data: Post }>(`/posts/${postID}`);
        return response.data.data || response.data;
    },

    // Create new post (requires authentication)
    async createPost(data: {
        title: string;
        bodyText: string;
        mediaURL?: string[];
    }): Promise<Post> {
        const response = await apiClient.post<{ data: Post }>('/posts', data);
        return response.data.data || response.data;
    },

    // Update existing post (requires authentication)
    async updatePost(postID: string, data: {
        title: string;
        bodyText: string;
        mediaURL?: string[];
    }): Promise<Post> {
        const response = await apiClient.put<{ data: Post }>(`/posts/${postID}`, data);
        return response.data.data || response.data;
    },

    // Like a post (requires authentication)
    async likePost(postID: string): Promise<any> {
        const response = await apiClient.post(`/posts/${postID}/like`);
        return response.data;
    },

    // Create comment on post (requires authentication)
    async createComment(postID: string, text: string, mediaURL?: string): Promise<any> {
        const response = await apiClient.post(`/posts/${postID}/comments`, { text, mediaURL });
        return response.data;
    },

    // Delete comment (requires authentication)
    async deleteComment(postID: string, commentID: string): Promise<void> {
        await apiClient.delete(`/posts/${postID}/comments/${commentID}`);
    },
};
