import {create} from 'zustand';
import {AuthState} from '@/types';
import apiService from '@/services/apiService';

// Add interface for API response
interface AuthResponse {
    user: AuthState['user'];
}

interface AuthStore extends AuthState {
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string, nickname: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => void;
}

const useAuthStore = create<AuthStore>((set, get) => {
    // Define the actions outside of the returned object to ensure stability
    const login = async (username: string, password: string) => {
        set({isLoading: true, error: null});
        try {
            const response = await apiService.auth.login(username, password) as AuthResponse;
            set({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to login'
            });
            throw error;
        }
    };

    const register = async (username: string, password: string, nickname: string) => {
        set({isLoading: true, error: null});
        try {
            const response = await apiService.auth.register(username, password, nickname) as AuthResponse;
            set({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to register'
            });
            throw error;
        }
    };

    const logout = async () => {
        set({isLoading: true});
        try {
            await apiService.auth.logout();
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to logout'
            });
        }
    };

    const checkAuth = () => {
        const user = apiService.auth.getCurrentUser();
        if (user) {
            set({user, isAuthenticated: true});
        }
    };

    return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login,
        register,
        logout,
        checkAuth
    };
});

export default useAuthStore; 