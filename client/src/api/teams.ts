import apiClient from './client';

export interface TeamMember {
    userID: string;
    username: string;
    firstName?: string;
    lastName?: string;
    TeamMember?: {
        role: string;
    };
}

export interface Team {
    teamID: string;
    teamName: string;
    isPersonal: boolean;
    Users?: TeamMember[];
}

export const teamsAPI = {
    // Get all teams for current user
    async getTeams(): Promise<Team[]> {
        const response = await apiClient.get<{ data: Team[] }>('/teams');
        return response.data.data || [];
    },

    // Get team by ID
    async getTeamById(teamID: string): Promise<Team> {
        const response = await apiClient.get<{ data: Team }>(`/teams/${teamID}`);
        return response.data.data;
    },

    // Add member to team
    async addTeamMember(teamID: string, username: string, role: string = 'Contributor'): Promise<void> {
        await apiClient.post(`/teams/${teamID}/members`, { username, role });
    },

    // Remove member from team
    async removeTeamMember(teamID: string, userID: string): Promise<void> {
        await apiClient.delete(`/teams/${teamID}/members/${userID}`);
    },

    // Create new team
    async createTeam(teamName: string): Promise<Team> {
        const response = await apiClient.post<{ data: Team }>('/teams', { teamName });
        return response.data.data;
    },

    // Update team
    async updateTeam(teamID: string, teamName: string): Promise<Team> {
        const response = await apiClient.put<{ data: Team }>(`/teams/${teamID}`, { teamName });
        return response.data.data;
    },

    // Delete team
    async deleteTeam(teamID: string): Promise<void> {
        await apiClient.delete(`/teams/${teamID}`);
    },
};
