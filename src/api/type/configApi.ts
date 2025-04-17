import {ModelStatus} from '../type/modelApi';
import apiClient from '../apiClient';

// Config Types
export interface ApiConfig {
  id: number;
  userId: number;
  name: string;
  apiUrl: string;
  apiKey: string;
  headers: Record<string, string>;
  requestTemplate: Record<string, any>;
  responseTemplate: {
    roleField: string;
    contentField: string;
    thinkingTextField: string | null;
  };
}

export interface ConfigTestResponse {
  success: boolean;
  message: string;
  response?: {
    role: string;
    content: string;
    thinking?: string;
  };
  error?: string;
}

// Service Interface
export interface ConfigService {
  getConfigs(): Promise<ApiConfig[]>;
  getConfig(id: number): Promise<ApiConfig>;
  createConfig(configData: Omit<ApiConfig, 'id' | 'userId'>): Promise<ApiConfig>;
  updateConfig(id: number, configData: Partial<ApiConfig>): Promise<ApiConfig>;
  deleteConfig(id: number): Promise<boolean>;
  testConfig(configData: Omit<ApiConfig, 'id' | 'userId'>): Promise<ConfigTestResponse>;
  getModelStatus(configId: number): Promise<ModelStatus>;
}

export const configService: ConfigService = {
  getConfigs: async (): Promise<ApiConfig[]> => {
    const response = await apiClient.get('/config/getConfigs');
    return response.data;
  },
  
  getConfig: async (id: number): Promise<ApiConfig> => {
    const response = await apiClient.get(`/config/${id}`);
    return response.data;
  },
  
  createConfig: async (configData: Omit<ApiConfig, 'id' | 'userId'>): Promise<ApiConfig> => {
    const response = await apiClient.post('/config/createConfig', configData);
    return response.data;
  },
  
  updateConfig: async (id: number, configData: Partial<ApiConfig>): Promise<ApiConfig> => {
    const response = await apiClient.put(`/config/updateConfig/${id}`, configData);
    return response.data;
  },
  
  deleteConfig: async (id: number): Promise<boolean> => {
    await apiClient.delete(`/configs/${id}`);
    return true;
  },
  
  testConfig: async (configData: Omit<ApiConfig, 'id' | 'userId'>): Promise<ConfigTestResponse> => {
    const response = await apiClient.post('/config/test', configData);
    return response.data;
  },
  
  getModelStatus: async (configId: number): Promise<ModelStatus> => {
    const response = await apiClient.get(`/config/${configId}/models`);
    return response.data;
  }
};
