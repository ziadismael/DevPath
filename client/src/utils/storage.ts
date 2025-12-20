const TOKEN_KEY = 'devpath_token';
const USER_KEY = 'devpath_user';

export const storage = {
    // Token management
    setToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    },

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    },

    removeToken(): void {
        localStorage.removeItem(TOKEN_KEY);
    },

    // User data management
    setUser(user: any): void {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    getUser(): any | null {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    removeUser(): void {
        localStorage.removeItem(USER_KEY);
    },

    // Clear all auth data
    clearAuth(): void {
        this.removeToken();
        this.removeUser();
    },
};
