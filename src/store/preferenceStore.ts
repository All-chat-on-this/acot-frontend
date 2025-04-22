import {create} from 'zustand';
import {Preference} from '@/api/type/preferenceApi.ts';
import apiService from '@/api/apiService';
import {ThemeType} from '@/theme/types';
import i18n from '@/i18n/i18n';

interface PreferenceState {
  preference: Preference;
  isLoading: boolean;
  error: string | null;
}

interface PreferenceStore extends PreferenceState {
  fetchPreference: () => Promise<void>;
  updatePreference: (preference: Partial<Preference>) => Promise<void>;
  updateTheme: (theme: ThemeType) => Promise<void>;
  updateLanguage: (language: string) => Promise<void>;
  toggleShowThinking: () => Promise<void>;
  toggleSaveApiKey: () => Promise<void>;
}

const initialPreference: Preference = {
  theme: 'dreamlikeColorLight',
  showThinking: false,
  saveApiKey: true,
  language: 'en'
};

const usePreferenceStore = create<PreferenceStore>((set, get) => {
  // Define stable functions outside the returned object
  const fetchPreference = async () => {
    set({ isLoading: true, error: null });
    try {
      const preference = await apiService.preference.getPreference();

      // Apply language change to i18n
      if (preference.language) {
        i18n.changeLanguage(preference.language);
      }
      
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

      // Apply language change to i18n if updated
      if (newPreference.language) {
        i18n.changeLanguage(newPreference.language);
      }
      
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

  const updateLanguage = async (language: string) => {
    get().updatePreference({language});
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
    updateLanguage,
    toggleShowThinking,
    toggleSaveApiKey
  };
});

export default usePreferenceStore; 