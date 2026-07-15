import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CircularProgress, ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme';
import Layout from './components/layout';

const HomePage = lazy(()=>import('./pages/HomePage'));
const MaterialPage = lazy(()=>import('./pages/MaterialPage'));
const AboutPage = lazy(()=>import('./pages/AboutPage'));
const ContributePage = lazy(()=>import('./pages/ContributePage'));
const NotFoundPage = lazy(()=>import('./pages/NotFoundPage'));

const App: React.FC = ()=>{
  const theme = getTheme('light');
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Layout>
        <Suspense fallback={<Box sx={{ display:'flex', justifyContent:'center', py:6 }}><CircularProgress/></Box>}>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/material" element={<MaterialPage/>}/>
            <Route path="/about" element={<AboutPage/>}/>
            <Route path="/contribute" element={<ContributePage/>}/>
            <Route path="*" element={<NotFoundPage/>}/>
          </Routes>
        </Suspense>
      </Layout>
    </ThemeProvider>
  );
};
export default App;
