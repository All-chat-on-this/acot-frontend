import { create } from 'zustand';
import { ApiConfig } from '@/types';
import apiService from '@/api/apiService';

interface ConfigState {
  configs: ApiConfig[];
  currentConfig: ApiConfig | null;
  isLoading: boolean;
  error: string | null;
  testResult: {
    success: boolean;
    message: string;
    response?: any;
    error?: string;
  } | null;
  modelStatus: any | null;
}

interface ConfigStore extends ConfigState {
  fetchConfigs: () => Promise<void>;
  fetchConfig: (id: number) => Promise<void>;
  createConfig: (configData: Omit<ApiConfig, 'id' | 'userId'>) => Promise<ApiConfig>;
  updateConfig: (id: number, configData: Partial<ApiConfig>) => Promise<void>;
  deleteConfig: (id: number) => Promise<void>;
  testConfig: (configData: Partial<ApiConfig>) => Promise<void>;
  setCurrentConfig: (config: ApiConfig | null) => void;
  resetTestResult: () => void;
  fetchModelStatus: (configId: number) => Promise<void>;
}

const useConfigStore = create<ConfigStore>((set, get) => ({
  configs: [],
  currentConfig: null,
  isLoading: false,
  error: null,
  testResult: null,
  modelStatus: null,

  fetchConfigs: async () => {
    set({ isLoading: true, error: null });
    try {
      const configs = await apiService.configs.getConfigs();
      set({ configs, isLoading: false });
      
      // If there are configs but no current config, set the first one as current
      if (configs.length > 0 && !get().currentConfig) {
        set({ currentConfig: configs[0] });
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch configurations' 
      });
    }
  },

  fetchConfig: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const config = await apiService.configs.getConfig(id);
      set({ currentConfig: config, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch configuration' 
      });
    }
  },

  createConfig: async (configData) => {
    set({ isLoading: true, error: null });
    try {
      const newConfig = await apiService.configs.createConfig(configData);
      set(state => ({
        configs: [...state.configs, newConfig],
        currentConfig: newConfig,
        isLoading: false
      }));
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
    set({ isLoading: true, error: null });
    try {
      const updatedConfig = await apiService.configs.updateConfig(id, configData);
      set(state => ({
        configs: state.configs.map(config => 
          config.id === id ? updatedConfig : config
        ),
        currentConfig: state.currentConfig?.id === id 
          ? updatedConfig 
          : state.currentConfig,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to update configuration' 
      });
    }
  },

  deleteConfig: async (id: number) => {
    set({ isLoading: true, error: null });
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
    set({ isLoading: true, error: null, testResult: null });
    try {
      const result = await apiService.configs.testConfig(configData);
      set({ 
        testResult: result,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to test configuration',
        testResult: {
          success: false,
          message: 'Test failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  },

  setCurrentConfig: (config) => {
    set({ currentConfig: config });
  },

  resetTestResult: () => {
    set({ testResult: null });
  },
  
  fetchModelStatus: async (configId: number) => {
    set({ isLoading: true, error: null });
    try {
      const status = await apiService.configs.getModelStatus(configId);
      set({ 
        modelStatus: status,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch model status'
      });
    }
  }
}));

export default useConfigStore; 