import apiClient from './apiClient';
import { ApiService } from './type/userApi';
import { authService } from './type/authApi';
import { conversationService } from './type/modelApi';
import { messageService } from './type/modelApi';
import { configService } from './type/configApi';
import { preferencesService } from './type/userApi';

// Use environment variables for configuration
const ENV = import.meta.env.VITE_ENV || 'development';

// Export all services
const apiService: ApiService = {
  auth: authService,
  conversations: conversationService,
  messages: messageService,
  configs: configService,
  preferences: preferencesService,
  client: apiClient,
  env: {
    isDevelopment: ENV === 'development',
    isProduction: ENV === 'production'
  }
};

export default apiService; 