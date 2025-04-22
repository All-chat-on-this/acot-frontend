// User Types
export interface User {
    id: number;
    username: string;
    nickname: string;
    loginType?: number;
    token?: string;
    expiresIn?: number;
    isNewUser?: boolean;
}

export interface UserService {
    getUserInformation(): Promise<User | null>;

    updateNickname(nickname: string): Promise<boolean>;
}

import apiClient from '../apiClient';

export const userService: UserService = {
    getUserInformation: async (): Promise<User | null> => {
        try {
            const response = await apiClient.get('/user/information');
            if (response.data && response.data.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user information:', error);
            return null;
        }
    },

    updateNickname: async (nickname: string): Promise<boolean> => {
        try {
            const params = new URLSearchParams();
            params.append('nickname', nickname);

            const response = await apiClient.post('/user/update-nickname', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            return response.data && response.data.data === true;
        } catch (error) {
            console.error('Error updating nickname:', error);
            return false;
        }
    }
};