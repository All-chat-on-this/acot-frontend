import { create } from 'zustand';
import { UserPreferences } from '@/types';
import apiService from '@/api/apiService';
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

const usePreferencesStore = create<PreferencesStore>((set, get) => {
  // Define stable functions outside the returned object
  const fetchPreferences = async () => {
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
  };

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
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
  };

  const updateTheme = async (theme: ThemeType) => {
    get().updatePreferences({ theme });
  };

  const toggleShowThinking = async () => {
    const { showThinking } = get().preferences;
    get().updatePreferences({ showThinking: !showThinking });
  };

  const toggleSaveHistory = async () => {
    const { saveHistory } = get().preferences;
    get().updatePreferences({ saveHistory: !saveHistory });
  };

  return {
    preferences: initialPreferences,
    isLoading: false,
    error: null,
    fetchPreferences,
    updatePreferences,
    updateTheme,
    toggleShowThinking,
    toggleSaveHistory
  };
});

export default usePreferencesStore; 