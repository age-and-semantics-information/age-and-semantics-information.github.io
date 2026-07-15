import { createContext, useContext, ReactNode } from 'react';
import { useTheme } from '@mui/material/styles';
interface ThemeContextType { isDark: boolean; }
const ThemeContext = createContext<ThemeContextType>({ isDark: false });
export const ThemeContextProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return <ThemeContext.Provider value={{ isDark }}>{children}</ThemeContext.Provider>;
};
export const useThemeMode = () => useContext(ThemeContext);
export default ThemeContext;
