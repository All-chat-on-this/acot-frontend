import {create} from 'zustand';
import {ApiConfig, ApiConfigTestRequest} from '@/api/type/configApi.ts';
import apiService from '@/api/apiService';
import {CommonResult} from "@/types";
import {TestResult} from "@/pages/config/ConfigEditForm.tsx";

interface ConfigState {
    configs: ApiConfig[];
    currentConfig: ApiConfig | null;
    isLoading: boolean;
    error: string | null;
    testResult: CommonResult<TestResult> | null;
}

interface ConfigStore extends ConfigState {
    fetchConfigs: () => Promise<void>;
    fetchConfig: (id: number) => Promise<void>;
    createConfig: (configData: Omit<ApiConfig, 'id' | 'userId' | 'isAvailable'>) => Promise<ApiConfig>;
    updateConfig: (id: number, configData: Partial<ApiConfig>) => Promise<void>;
    deleteConfig: (id: number) => Promise<void>;
    testConfig: (configData: ApiConfigTestRequest) => Promise<void>;
    setCurrentConfig: (config: ApiConfig | null) => void;
    setCurrentConfigById: (id: number) => Promise<void>;
    resetTestResult: () => void;
}

const useConfigStore = create<ConfigStore>((set, get) => ({
    configs: [],
    currentConfig: null,
    isLoading: false,
    error: null,
    testResult: null,

    fetchConfigs: async () => {
        set({isLoading: true, error: null});
        try {
            const response = await apiService.configs.getConfigs();
            const responseConfigs = response.data;
            console.log(response);
            set({configs: responseConfigs, isLoading: false});

            // If there are configs but no current config, set the first one as current
            if (responseConfigs.length > 0 && !get().currentConfig) {
                set({currentConfig: responseConfigs[0]});
            }
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to fetch configurations'
            });
        }
    },

    fetchConfig: async (id: number) => {
        set({isLoading: true, error: null});
        try {
            const config = await apiService.configs.getConfig(id);
            set({currentConfig: config, isLoading: false});
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to fetch configuration'
            });
        }
    },

    createConfig: async (configData) => {
        set({isLoading: true, error: null});
        try {
            const newConfig = await apiService.configs.createConfig(configData);
            // Set the new config as current
            set({currentConfig: newConfig});

            // Fetch updated configs list to ensure UI is in sync
            await get().fetchConfigs();

            return newConfig;
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to create configuration'
            });
            throw error;
        }
    },

    updateConfig: async (id: number, configData) => {
        set({isLoading: true, error: null});
        try {
            await apiService.configs.updateConfig(id, configData);

            // Fetch the updated config to update the current config
            await get().fetchConfig(id);

            // Fetch updated configs list to ensure UI is in sync
            await get().fetchConfigs();
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to update configuration'
            });
        }
    },

    deleteConfig: async (id: number) => {
        set({isLoading: true, error: null});
        try {
            await apiService.configs.deleteConfig(id);
            set(state => {
                const newConfigs = state.configs.filter(config => config.id !== id);
                return {
                    configs: newConfigs,
                    currentConfig: state.currentConfig?.id === id
                        ? (newConfigs.length > 0 ? newConfigs[0] : null)
                        : state.currentConfig,
                    isLoading: false
                };
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to delete configuration'
            });
        }
    },

    testConfig: async (configData) => {
        set({isLoading: true, error: null, testResult: null});
        try {
            const result = await apiService.configs.testConfig(configData as ApiConfigTestRequest);
            set({
                testResult: result,
                isLoading: false
            });

            // If the test was successful and we're testing the current config with an ID, fetch it again
            const currentConfig = get().currentConfig;
            if (result.data?.success && currentConfig && configData.id && currentConfig.id === configData.id) {
                // Update the isAvailable property in the current config immediately
                set(state => ({
                    currentConfig: state.currentConfig ? {
                        ...state.currentConfig,
                        isAvailable: result.data.success
                    } : null
                }));

                // Also update the config in the configs list
                set(state => ({
                    configs: state.configs.map(config =>
                        config.id === currentConfig.id
                            ? {...config, isAvailable: result.data.success}
                            : config
                    )
                }));

                // Still fetch the updated config to ensure all properties are in sync
                await get().fetchConfig(currentConfig.id);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to test configuration';
            set({
                isLoading: false,
                error: errorMessage,
                testResult: {
                    code: 500,
                    msg: 'Test failed',
                    data: {
                        success: false,
                        message: errorMessage,
                        error: errorMessage
                    } as TestResult
                }
            });
        }
    },

    setCurrentConfig: (config) => {
        set({currentConfig: config});
    },

    setCurrentConfigById: async (id: number) => {
        const find = get().configs.find(config => config.id === id);
        set({currentConfig: find});
    },

    resetTestResult: () => {
        set({testResult: null});
    }
}));

export default useConfigStore; 