import {create} from 'zustand';
import {AuthState} from '@/types';
import apiService from '@/services/apiService';

interface AuthStore extends AuthState {
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string, nickname: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => void;
}

const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (username: string, password: string) => {
        set({isLoading: true, error: null});
        try {
            const response = await apiService.auth.login(username, password);
            set({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
            return response;
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to login'
            });
            throw error;
        }
    },

    register: async (username: string, password: string, nickname: string) => {
        set({isLoading: true, error: null});
        try {
            const response = await apiService.auth.register(username, password, nickname);
            set({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
            return response;
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to register'
            });
            throw error;
        }
    },

    logout: async () => {
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
    },

    checkAuth: () => {
        const user = apiService.auth.getCurrentUser();
        if (user) {
            set({user, isAuthenticated: true});
        }
    }
}));

export default useAuthStore; 