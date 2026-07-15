import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light'|'dark') => {
  const isDark = mode === 'dark';
  // ALPS-inspired colors, with our blue primary instead of teal
  const colors = {
    primary: isDark ? { main: '#90caf9', light: '#1e2a36', dark: '#64b5f6', contrastText: '#0a1929' } : { main: '#0d47a1', light: '#e3f2fd', dark: '#002171', contrastText: '#fff' },
    secondary: isDark ? { main: '#ffab91', light: '#3a2319', dark: '#ff8a65' } : { main: '#00695c', light: '#e0f2f1', dark: '#003d33' },
    typeLabels: isDark ? { main: '#ffab70', light: '#3a2a1e', dark: '#ffcc9a', contrastText: '#2b1a0f' } : { main: '#c46f43', light: '#fae5d6', dark: '#98512f', contrastText: '#fff' },
    labels: isDark ? { main: '#90caf9', light: '#1e2a36', dark: '#bbdefb', contrastText: '#0a1929' } : { main: '#4e746d', light: '#e6eeeb', dark: '#3b5c56', contrastText: '#fff' },
  };
  return createTheme({
    palette: {
      mode,
      primary: { main: colors.primary.main, light: colors.primary.light, dark: colors.primary.dark, contrastText: colors.primary.contrastText },
      secondary: { main: colors.secondary.main, light: colors.secondary.light, dark: colors.secondary.dark },
      background: { default: isDark ? '#121212' : '#fafafa', paper: isDark ? '#1e1e1e' : '#ffffff' },
      // @ts-ignore custom palettes
      typeLabels: colors.typeLabels,
      labels: colors.labels,
      text: { primary: isDark ? '#ecefed' : '#202927', secondary: isDark ? '#b3b8b6' : '#63706b' },
      divider: isDark ? '#303433' : '#e0e0e0',
    },
    typography: {
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 700, fontSize: '1rem', lineHeight: 1.25 },
    },
    shape: { borderRadius: 4 },
    components: {
      MuiCard: { styleOverrides: { root: { borderRadius: 4 } } },
      MuiChip: { styleOverrides: { root: { borderRadius: 4, fontWeight: 650 } } },
      MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 4, fontWeight: 650 } } },
    },
  });
};
