import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {ThemeProvider as StyledThemeProvider} from 'styled-components';
import themes from './themes';
import {ThemeProps, ThemeType} from './types';
import GlobalStyles from './GlobalStyles';
import usePreferenceStore from '@/store/userStore.ts';

interface ThemeContextType {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themeProps: ThemeProps;
  isDark: boolean;
}

// Default theme properties
const defaultTheme = themes.dreamlikeColorLight;

export const ThemeContext = createContext<ThemeContextType>({
  currentTheme: 'dreamlikeColorLight', // Default theme
  setTheme: () => {},
  themeProps: defaultTheme,
  isDark: false
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const {preferences} = usePreferenceStore();
  
  // Try to get the saved theme from preferences or localStorage, or default to dreamlikeColorLight
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('acot-theme');
    return (savedTheme as ThemeType) || preferences.theme || 'dreamlikeColorLight';
  });

  // Get the current theme properties
  const themeProps = themes[currentTheme] || defaultTheme;
  
  // Determine if it's a dark theme
  const isDark = currentTheme.includes('Dark') || currentTheme === 'dark';

  // Function to change the theme
  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
    localStorage.setItem('acot-theme', theme);
  };

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('acot-theme', currentTheme);
  }, [currentTheme]);

  // Sync with preferences when they change
  useEffect(() => {
    if (preferences.theme && preferences.theme !== currentTheme) {
      setCurrentTheme(preferences.theme as ThemeType);
    }
  }, [preferences.theme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themeProps, isDark }}>
      <StyledThemeProvider theme={{ ...themeProps, isDark }}>
        <GlobalStyles />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 