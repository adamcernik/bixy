'use client';

import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  toggleColorMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    // Always use dark mode, regardless of system preference
    setMode('dark');
  }, []);

  const colorMode = {
    mode,
    toggleColorMode: () => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    },
  };

  const theme = createTheme({
    palette: {
      mode,
      ...(mode === 'dark' && {
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
        primary: {
          main: '#90caf9',
        },
        secondary: {
          main: '#ce93d8',
        },
      }),
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: mode === 'dark' ? '#2b2b2b #121212' : '#959595 #f5f5f5',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              backgroundColor: mode === 'dark' ? '#121212' : '#f5f5f5',
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 8,
              backgroundColor: mode === 'dark' ? '#2b2b2b' : '#959595',
              minHeight: 24,
            },
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
} 