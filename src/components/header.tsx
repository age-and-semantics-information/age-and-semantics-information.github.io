import * as React from 'react';
import { AppBar, Button, Toolbar, Typography, Box, IconButton, useMediaQuery, useTheme, Collapse, Stack } from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
const pages = [
  { name: 'Papers', href: '/' },
  { name: 'Authors', href: '/authors' },
  { name: 'Material', href: '/material' },
  { name: 'Contribute', href: '/contribute' },
  { name: 'About', href: '/about' },
];
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor:'background.paper', color:'text.primary', borderBottom:1, borderColor:'divider' }}>
      <Toolbar disableGutters sx={{ minHeight:{xs:56, md:64}, px:{xs:2, md:3} }}>
        <Typography variant={isMobile?'h6':'h6'} noWrap component={RouterLink} to="/" sx={{ mr:{xs:1, md:4}, fontWeight:800, flexGrow:1, fontSize:{xs:'0.95rem', sm:'1.1rem', md:'1.25rem'}, color:'primary.main', textDecoration:'none', letterSpacing:'-0.02em' }}>
          {isMobile ? 'AoI & Semantics' : 'Age and Semantics of Information (ASoI)'}
        </Typography>
        <Box sx={{ display:{xs:'none', md:'flex'}, alignItems:'center' }}>
          {pages.map(page=>{
            const isActive = location.pathname===page.href;
            return (
              <Button key={page.name} component={RouterLink} to={page.href}
                sx={{ mr:0.5, px:1.5, py:0.75, borderRadius:1, color:isActive?'primary.dark':'text.secondary', bgcolor:isActive?'primary.light':'transparent', fontWeight:isActive?700:600, '&:hover':{bgcolor:isActive?'primary.light':'action.hover'} }}>
                {page.name}
              </Button>
            );
          })}
        </Box>
        <Box sx={{ display:{xs:'flex', md:'none'}, alignItems:'center' }}>
          <IconButton color="inherit" onClick={()=>setMobileMenuOpen(!mobileMenuOpen)} sx={{ml:1}}>
            {mobileMenuOpen ? <CloseIcon/> : <MenuIcon/>}
          </IconButton>
        </Box>
      </Toolbar>
      <Collapse in={mobileMenuOpen && isMobile}>
        <Box sx={{ bgcolor:'background.paper', borderTop:1, borderColor:'divider' }}>
          <Stack spacing={0}>
            {pages.map(page=>{
              const isActive = location.pathname===page.href;
              return (
                <Button key={page.name} component={RouterLink} to={page.href} onClick={()=>setMobileMenuOpen(false)}
                  sx={{ justifyContent:'flex-start', px:3, py:1.5, color:isActive?'primary.main':'text.secondary', bgcolor:isActive?'action.selected':'transparent', fontWeight:isActive?700:500 }}>
                  {page.name}
                </Button>
              );
            })}
          </Stack>
        </Box>
      </Collapse>
    </AppBar>
  );
};
export default Header;
