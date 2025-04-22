import apiClient from './apiClient';
import {authService} from './type/authApi';
import {conversationService, messageService} from './type/modelApi';
import {configService} from './type/configApi';
import {preferenceService} from './type/preferenceApi';
import {userService} from './type/userApi';
import {ApiService} from "@/types";

// Use environment variables for configuration
const ENV = import.meta.env.VITE_ENV || 'development';

// Export all services
const apiService: ApiService = {
    auth: authService,
    conversations: conversationService,
    messages: messageService,
    configs: configService,
    preference: preferenceService,
    user: userService,
    client: apiClient,
    env: {
        isDevelopment: ENV === 'development',
        isProduction: ENV === 'production'
    }
};

export default apiService; 