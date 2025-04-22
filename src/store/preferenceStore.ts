import {create} from 'zustand';
import {Preference} from '@/api/type/preferenceApi.ts';
import apiService from '@/api/apiService';
import {ThemeType} from '@/theme/types';

interface PreferenceState {
  preference: Preference;
  isLoading: boolean;
  error: string | null;
}

interface PreferenceStore extends PreferenceState {
  fetchPreference: () => Promise<void>;
  updatePreference: (preference: Partial<Preference>) => Promise<void>;
  updateTheme: (theme: ThemeType) => Promise<void>;
  toggleShowThinking: () => Promise<void>;
  toggleSaveApiKey: () => Promise<void>;
}

const initialPreference: Preference = {
  theme: 'dreamlikeColorLight',
  showThinking: false,
  saveApiKey: true
};

const usePreferenceStore = create<PreferenceStore>((set, get) => {
  // Define stable functions outside the returned object
  const fetchPreference = async () => {
    set({ isLoading: true, error: null });
    try {
      const preference = await apiService.preference.getPreference();
      set({preference, isLoading: false});
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch preference' 
      });
    }
  };

  const updatePreference = async (newPreference: Partial<Preference>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPreference = await apiService.preference.updatePreference({
        ...get().preference,
        ...newPreference
      });
      set({preference: updatedPreference, isLoading: false});
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update preference' 
      });
    }
  };

  const updateTheme = async (theme: ThemeType) => {
    get().updatePreference({theme});
  };

  const toggleShowThinking = async () => {
    const {showThinking} = get().preference;
    get().updatePreference({showThinking: !showThinking});
  };

  const toggleSaveApiKey = async () => {
    const {saveApiKey} = get().preference;
    get().updatePreference({saveApiKey: !saveApiKey});
  };

  return {
    preference: initialPreference,
    isLoading: false,
    error: null,
    fetchPreference,
    updatePreference,
    updateTheme,
    toggleShowThinking,
    toggleSaveApiKey
  };
});

export default usePreferenceStore; 