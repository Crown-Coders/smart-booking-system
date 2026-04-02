import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const lightColors = {
  primary: '#002324',
  primaryLight: '#EBFACF',
  accent: '#A1AD95',
  background: '#F7F8F7',
  surface: '#FFFFFF',
  text: '#002324',
  textSecondary: '#A1AD95',
  border: '#E5DDDE',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
};

export const darkColors = {
  ...lightColors,
  primary: '#EBFACF',
  primaryLight: '#002324',
  background: '#121212',
  surface: '#1E1E1E',
  text: '#EBFACF',
  border: '#333333',
};

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const saved = await AsyncStorage.getItem('theme');
      if (saved !== null) {
        setIsDarkMode(saved === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        colors: isDarkMode ? darkColors : lightColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}