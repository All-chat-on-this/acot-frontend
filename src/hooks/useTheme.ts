import {useContext} from 'react';
import {ThemeContext} from '@/theme/ThemeProvider';
import usePreferenceStore from '@/store/preferenceStore';

const useTheme = () => {
    const {currentTheme, setTheme, themeProps} = useContext(ThemeContext);
    const {updateTheme} = usePreferenceStore();

    const handleThemeChange = async (newTheme: string) => {
        setTheme(newTheme);
        await updateTheme(newTheme);
    };

    return {
        currentTheme,
        setTheme: handleThemeChange,
        themeProps,
        // Helper function to toggle between light and dark variants
        toggleLightDark: async () => {
            if (currentTheme === 'light') {
                await handleThemeChange('dark');
            } else if (currentTheme === 'dark') {
                await handleThemeChange('light');
            } else if (currentTheme === 'dreamlikeColorLight') {
                await handleThemeChange('dreamlikeColorDark');
            } else if (currentTheme === 'dreamlikeColorDark') {
                await handleThemeChange('dreamlikeColorLight');
            }
        },
        // Helper function to toggle between standard and dreamlikeColor variants
        toggleDreamlikeColor: async () => {
            if (currentTheme === 'light') {
                await handleThemeChange('dreamlikeColorLight');
            } else if (currentTheme === 'dark') {
                await handleThemeChange('dreamlikeColorDark');
            } else if (currentTheme === 'dreamlikeColorLight') {
                await handleThemeChange('light');
            } else if (currentTheme === 'dreamlikeColorDark') {
                await handleThemeChange('dark');
            }
        }
    };
};

export default useTheme; 