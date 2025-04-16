import apiClient from '../apiClient';

// Preferences Types
export interface UserPreferences {
  theme: string;
  showThinking: boolean;
  saveHistory: boolean;
}

export interface PreferencesService {
  getPreferences(): Promise<UserPreferences>;
  updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences>;
}

// Main API Service
export interface ApiService {
  auth: any;
  conversations: any;
  messages: any;
  configs: any;
  preferences: PreferencesService;
  client: any; // AxiosInstance
  env: {
    isDevelopment: boolean;
    isProduction: boolean;
  };
}

// Real API Implementation
export const preferencesService: PreferencesService = {
  getPreferences: async (): Promise<UserPreferences> => {
    const response = await apiClient.get('/preferences');
    return response.data;
  },
  
  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
    const response = await apiClient.put('/preferences', preferences);
    return response.data;
  }
};
