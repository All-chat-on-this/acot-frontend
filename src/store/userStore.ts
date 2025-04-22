import {create} from 'zustand';
import {User} from '@/api/type/userApi.ts';
import apiService from '@/api/apiService';

interface UserState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

interface UserStoreActions {
    getUserInformation: () => Promise<void>;
    updateNickname: (nickname: string) => Promise<boolean>;
    clearUserData: () => void;
    clearErrors: () => void;
}

type UserStore = UserState & UserStoreActions;

const useUserStore = create<UserStore>((set, get) => {
    const getUserInformation = async () => {
        set({isLoading: true, error: null});
        try {
            const user = await apiService.user.getUserInformation();
            set({
                user,
                isLoading: false,
                error: null
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to fetch user information'
            });
        }
    };

    const updateNickname = async (nickname: string) => {
        set({isLoading: true, error: null});
        try {
            const success = await apiService.user.updateNickname(nickname);
            if (success && get().user) {
                // Update the local user object with the new nickname
                set({
                    user: {
                        ...get().user!,
                        nickname
                    },
                    isLoading: false,
                    error: null
                });
            } else {
                set({isLoading: false});
            }
            return success;
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to update nickname'
            });
            return false;
        }
    };

    const clearUserData = () => {
        set({user: null, error: null});
    };

    const clearErrors = () => {
        set({error: null});
    };

    return {
        user: null,
        isLoading: false,
        error: null,
        getUserInformation,
        updateNickname,
        clearUserData,
        clearErrors
    };
});

export default useUserStore;
