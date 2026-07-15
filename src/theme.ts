import { createTheme } from '@mui/material/styles';
export const getTheme = (mode: 'light'|'dark') => createTheme({
  palette: {
    mode,
    primary: { main: '#0d47a1', light: '#5472d3', dark: '#002171', contrastText: '#fff' },
    secondary: { main: '#00695c', light: '#439889', dark: '#003d33' },
    background: { default: mode==='light'?'#fafafa':'#121212', paper: mode==='light'?'#ffffff':'#1e1e1e' },
  },
  typography: { fontFamily: 'Roboto, Helvetica, Arial, sans-serif', h5:{fontWeight:700} },
  shape: { borderRadius: 8 },
  components: {
    MuiCard: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 6 } } },
  }
});
