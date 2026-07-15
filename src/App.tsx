import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CircularProgress, ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme';
import Layout from './components/layout';
import { ThemeContextProvider } from './contexts/ThemeContext';

const HomePage = lazy(()=>import('./pages/HomePage'));
const MaterialPage = lazy(()=>import('./pages/MaterialPage'));
const AboutPage = lazy(()=>import('./pages/AboutPage'));
const ContributePage = lazy(()=>import('./pages/ContributePage'));
const NotFoundPage = lazy(()=>import('./pages/NotFoundPage'));
const AuthorGraphPage = lazy(()=>import('./pages/AuthorGraphPage'));

const App: React.FC = ()=>{
  const theme = getTheme('light');
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <ThemeContextProvider>
        <Layout>
          <Suspense fallback={<Box sx={{ display:'flex', justifyContent:'center', py:6 }}><CircularProgress/></Box>}>
            <Routes>
              <Route path="/" element={<HomePage/>}/>
              <Route path="/authors" element={<AuthorGraphPage/>}/>
              <Route path="/material" element={<MaterialPage/>}/>
              <Route path="/about" element={<AboutPage/>}/>
              <Route path="/contribute" element={<ContributePage/>}/>
              <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
          </Suspense>
        </Layout>
      </ThemeContextProvider>
    </ThemeProvider>
  );
};
export default App;
