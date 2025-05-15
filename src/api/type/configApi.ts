import apiClient from '../apiClient';
import {CommonResult} from "@/types";
import {TestResult} from "@/pages/config/ConfigEditForm.tsx";

// Config Types
export interface ApiConfig {
    id: number;
    userId: number;
    name: string;
    apiUrl: string;
    apiKey: string;
    isAvailable: boolean;
    apiKeyPlacement?: string;
    apiKeyHeader?: string;
    apiKeyBodyPath?: string;
    headers: Record<string, string>;
    requestTemplate: Record<string, string>;
    responseTemplate: Record<string, string>;
    // Request Role field names
    requestUserRoleField?: string;
    requestAssistantField?: string;
    requestSystemField?: string;
    // Request and Response handling strategy
    requestMessageGroupPath?: string;
    requestRolePathFromGroup?: string;
    requestTextPathFromGroup?: string;
    responseTextPath?: string;
    responseThinkingTextPath?: string;
}

// Type for test operation that includes secret key
export interface ApiConfigTestRequest extends Omit<ApiConfig, 'userId' | 'isAvailable'> {
    secretKey?: string;
}

// Service Interface
export interface ConfigService {
    getConfigs(): Promise<CommonResult<ApiConfig[]>>;

    getConfig(id: number): Promise<ApiConfig>;

    createConfig(configData: Omit<ApiConfig, 'id' | 'userId' | 'isAvailable'>): Promise<CommonResult<ApiConfig>>;

    updateConfig(id: number, configData: Partial<ApiConfig>): Promise<ApiConfig>;

    deleteConfig(id: number): Promise<boolean>;

    testConfig(configData: ApiConfigTestRequest): Promise<CommonResult<TestResult>>;
}

export const configService: ConfigService = {
    getConfigs: async (): Promise<CommonResult<ApiConfig[]>> => {
        const response = await apiClient.get('/config/getConfigs');
        return response.data;
    },

    getConfig: async (id: number): Promise<ApiConfig> => {
        const response = await apiClient.get(`/config/${id}`);
        return response.data.data;
    },

    createConfig: async (configData: Omit<ApiConfig, 'id' | 'userId' | 'isAvailable'>): Promise<CommonResult<ApiConfig>> => {
        const response = await apiClient.post('/config/createConfig', configData);
        return response.data;
    },

    updateConfig: async (id: number, configData: Partial<ApiConfig>): Promise<ApiConfig> => {
        const response = await apiClient.put(`/config/updateConfig/${id}`, configData);
        return response.data;
    },

    deleteConfig: async (id: number): Promise<boolean> => {
        await apiClient.delete(`/config/${id}`);
        return true;
    },

    testConfig: async (configData: ApiConfigTestRequest): Promise<CommonResult<TestResult>> => {
        const response = await apiClient.post('/config/test', configData);
        return response.data;
    }
};
