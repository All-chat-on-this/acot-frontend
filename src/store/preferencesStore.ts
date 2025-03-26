import { create } from 'zustand';
import { UserPreferences } from '@/types';
import apiService from '@/services/apiService';
import { ThemeType } from '@/theme/types';

interface PreferencesState {
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
}

interface PreferencesStore extends PreferencesState {
  fetchPreferences: () => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  updateTheme: (theme: ThemeType) => Promise<void>;
  toggleShowThinking: () => Promise<void>;
  toggleSaveHistory: () => Promise<void>;
}

const initialPreferences: UserPreferences = {
  theme: 'dreamlikeColorLight',
  showThinking: false,
  saveHistory: true
};

const usePreferencesStore = create<PreferencesStore>((set, get) => ({
  preferences: initialPreferences,
  isLoading: false,
  error: null,

  fetchPreferences: async () => {
    set({ isLoading: true, error: null });
    try {
      const preferences = await apiService.preferences.getPreferences();
      set({ preferences, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch preferences' 
      });
    }
  },

  updatePreferences: async (newPreferences) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPreferences = await apiService.preferences.updatePreferences({
        ...get().preferences,
        ...newPreferences
      });
      set({ preferences: updatedPreferences, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to update preferences' 
      });
    }
  },

  updateTheme: async (theme: ThemeType) => {
    get().updatePreferences({ theme });
  },

  toggleShowThinking: async () => {
    const { showThinking } = get().preferences;
    get().updatePreferences({ showThinking: !showThinking });
  },

  toggleSaveHistory: async () => {
    const { saveHistory } = get().preferences;
    get().updatePreferences({ saveHistory: !saveHistory });
  }
}));

export default usePreferencesStore; 