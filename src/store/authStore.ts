import {create} from 'zustand';
import {AuthState} from '@/types';
import apiService from '@/api/apiService';

// QQ Social Login Constants
const SOCIAL_TYPE = {
    QQ: 36
};

const USER_TYPE = {
    NORMAL: 1
};

interface AuthStore extends AuthState {
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string, nickname: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    qqLogin: (code: string, state: string) => Promise<void>;
    getQQAuthorizeUrl: (redirectUri: string) => Promise<string | null>;
    clearErrors: () => void;
}

const useAuthStore = create<AuthStore>((set, get) => {
    // Define the actions outside of the returned object to ensure stability
    const login = async (username: string, password: string) => {
        set({isLoading: true, error: null});
        try {
            const response = await apiService.auth.login(username, password);
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
            const response = await apiService.auth.register(username, password, nickname);
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
        set({isLoading: true, error: null});
        try {
            const token = localStorage.getItem('acot-token');
            if (token) {
                await apiService.auth.logout(token);
            }
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            });
        } catch (error) {
            // Even if logout fails, we clear the local state
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to logout'
            });
        }
    };

    const checkAuth = async () => {
        const token = localStorage.getItem('acot-token');
        const user = apiService.auth.getCurrentUser();
        
        if (!token || !user) {
            set({user: null, isAuthenticated: false});
            return;
        }
        
        try {
            // Validate the token with the backend
            const isValid = await apiService.auth.validateToken(token);
            if (isValid) {
                set({user, isAuthenticated: true});
            } else {
                // If token is invalid, clear storage and state
                localStorage.removeItem('acot-token');
                localStorage.removeItem('acot-user');
                set({user: null, isAuthenticated: false});
            }
        } catch (error) {
            // If validation fails, assume token is invalid
            localStorage.removeItem('acot-token');
            localStorage.removeItem('acot-user');
            set({
                user: null, 
                isAuthenticated: false,
                error: error instanceof Error ? error.message : 'Session expired'
            });
        }
    };

    const qqLogin = async (code: string, state: string) => {
        set({isLoading: true, error: null});
        try {
            const response = await apiService.auth.socialLogin(SOCIAL_TYPE.QQ, USER_TYPE.NORMAL, code, state);
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
                error: error instanceof Error ? error.message : 'Failed to login with QQ'
            });
            throw error;
        }
    };

    const getQQAuthorizeUrl = async (redirectUri: string) => {
        set({error: null});
        try {
            return await apiService.auth.getSocialAuthorizeUrl(SOCIAL_TYPE.QQ, USER_TYPE.NORMAL, redirectUri);
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to get QQ authorization URL'
            });
            return null;
        }
    };

    const clearErrors = () => {
        set({error: null});
    };

    return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login,
        register,
        logout,
        checkAuth,
        qqLogin,
        getQQAuthorizeUrl,
        clearErrors
    };
});

export default useAuthStore; 