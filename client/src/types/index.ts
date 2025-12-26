// User types
export interface User {
    userID?: string;
    id?: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    university?: string;
    country?: string;
    role: 'User' | 'Admin';
    followers?: User[];
    following?: User[];
}

// Auth types
export interface LoginRequest {
    username: string;
    password: string;
}

export interface SignupRequest {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

// Internship types
export interface Internship {
    internshipID?: string;
    id?: number;
    company?: string;
    title?: string;
    position?: string;
    description?: string;
    location?: string;
    type?: 'Remote' | 'Hybrid' | 'On-site';
    requirements?: string[];
    responsibilities?: string[];
    techStack?: string[];
    salary?: string;
    applicationDeadline?: string;
    postedDate?: string;
    mediaURL?: string;
    applyLink?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Project types
export interface Project {
    projectID?: string;
    id?: number;
    projectName: string;
    description: string;
    techStack?: string[];
    gitHubRepo?: string;
    liveDemoURL?: string;
    screenshots?: string[];
    createdAt?: string;
    updatedAt?: string;
    user?: {
        username: string;
        firstName?: string;
        lastName?: string;
    };
    Team?: {
        teamID?: string;
        teamName?: string;
        isPersonal?: boolean;
        Users?: Array<{
            userID: string;
            username: string;
            firstName?: string;
            lastName?: string;
            TeamMember?: {
                role: string;
            };
        }>;
    };
}

export interface CreateProjectRequest {
    projectName: string;
    description: string;
    techStack?: string[];
    gitHubRepo?: string;
    liveDemoURL?: string;
    screenshots?: string[];
    teamID?: string;
}

// Community/Post types
export interface Post {
    postID?: string;
    id?: number;
    userID?: string;
    title: string;
    bodyText: string;
    mediaURL?: string[];
    likes?: number;
    createdAt?: string;
    updatedAt?: string;
    user?: {
        username: string;
        firstName?: string;
        lastName?: string;
    };
    User?: {
        username: string;
        firstName?: string;
        lastName?: string;
    };
    comments?: Comment[];
    Comments?: Comment[];
    likedByCurrentUser?: boolean;
}

export interface CreatePostRequest {
    title: string;
    bodyText: string;
    mediaURL?: string;
}

export interface Comment {
    commentID?: string;
    id?: number;
    text: string;
    mediaURL?: string;
    createdAt?: string;
    user?: {
        username: string;
        firstName?: string;
        lastName?: string;
    };
    User?: {
        username: string;
        firstName?: string;
        lastName?: string;
    };
}

export interface CreateCommentRequest {
    text: string;
    mediaURL?: string;
}

// Profile update type
export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    username?: string;
    university?: string;
    country?: string;
    password?: string;
}

// API Error type
export interface APIError {
    message: string;
    status?: number;
    errors?: Record<string, string[]>;
}

