import { Container, Box, CssBaseline } from '@mui/material';
import { ReactNode } from 'react';
import Header from './header';
const Layout: React.FC<{children: ReactNode}> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <Box sx={{ minHeight:'100vh', bgcolor:'background.default', color:'text.primary' }}>
        <Header />
        <main>
          <Container maxWidth={false} disableGutters sx={{ py: 2 }}>
            {children}
          </Container>
        </main>
      </Box>
    </>
  );
};
export default Layout;
