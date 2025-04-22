import apiClient from '../apiClient';

// Preference Types
export interface Preference {
    theme: string;
    showThinking: boolean;
    saveHistory: boolean;
}

export interface PreferenceService {
    getPreference(): Promise<Preference>;

    updatePreference(preferences: Partial<Preference>): Promise<Preference>;
}

// Real API Implementation
export const preferenceService: PreferenceService = {
    getPreference: async (): Promise<Preference> => {
        const response = await apiClient.get('/preference/getPreference');
        return response.data;
    },

    updatePreference: async (preferences: Partial<Preference>): Promise<Preference> => {
        const response = await apiClient.put('/preference/updatePreference', preferences);
        return response.data;
    }
};
