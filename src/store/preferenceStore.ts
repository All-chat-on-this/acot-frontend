import {create} from 'zustand';
import {Preference} from '@/api/type/preferenceApi.ts';
import apiService from '@/api/apiService';
import {ThemeType} from '@/theme/types';

interface PreferenceState {
  preferences: Preference;
  isLoading: boolean;
  error: string | null;
}

interface PreferenceStore extends PreferenceState {
  fetchPreference: () => Promise<void>;
  updatePreference: (preferences: Partial<Preference>) => Promise<void>;
  updateTheme: (theme: ThemeType) => Promise<void>;
  toggleShowThinking: () => Promise<void>;
  toggleSaveHistory: () => Promise<void>;
}

const initialPreference: Preference = {
  theme: 'dreamlikeColorLight',
  showThinking: false,
  saveHistory: true
};

const usePreferenceStore = create<PreferenceStore>((set, get) => {
  // Define stable functions outside the returned object
  const fetchPreference = async () => {
    set({ isLoading: true, error: null });
    try {
      const preferences = await apiService.preference.getPreference();
      set({ preferences, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch preferences' 
      });
    }
  };

  const updatePreference = async (newPreference: Partial<Preference>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPreference = await apiService.preference.updatePreference({
        ...get().preferences,
        ...newPreference
      });
      set({preferences: updatedPreference, isLoading: false});
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to update preferences' 
      });
    }
  };

  const updateTheme = async (theme: ThemeType) => {
    get().updatePreference({theme});
  };

  const toggleShowThinking = async () => {
    const { showThinking } = get().preferences;
    get().updatePreference({showThinking: !showThinking});
  };

  const toggleSaveHistory = async () => {
    const { saveHistory } = get().preferences;
    get().updatePreference({saveHistory: !saveHistory});
  };

  return {
    preferences: initialPreference,
    isLoading: false,
    error: null,
    fetchPreference,
    updatePreference,
    updateTheme,
    toggleShowThinking,
    toggleSaveHistory
  };
});

export default usePreferenceStore; 