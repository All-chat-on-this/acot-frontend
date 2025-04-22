import apiClient from '../apiClient';

// Preference Types
export interface Preference {
    theme: string;
    showThinking: boolean;
    saveApiKey: boolean;
}

export interface PreferenceService {
    getPreference(): Promise<Preference>;

    updatePreference(preference: Partial<Preference>): Promise<Preference>;
}

// Real API Implementation
export const preferenceService: PreferenceService = {
    getPreference: async (): Promise<Preference> => {
        const response = await apiClient.get('/preference/getPreference');
        return response.data;
    },

    updatePreference: async (preference: Partial<Preference>): Promise<Preference> => {
        const response = await apiClient.put('/preference/updatePreference', preference);
        return response.data;
    }
};
