/* eslint-disable react/jsx-no-useless-fragment */
import { styled, Box } from '@mui/material';
import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/navbar/navbar.component';
import Sidebar, { drawerWidth } from './components/sidebar/sidebar.component';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = React.useState(true);
  const { pathname } = useLocation();

  const routesWithoutLayout = ['/'];

  const isRouteWithoutLayout = routesWithoutLayout.includes(pathname);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return isRouteWithoutLayout ? (
    <>{children}</>
  ) : (
    <Box sx={{ display: 'flex' }}>
      <Sidebar handleDrawerClose={handleDrawerClose} open={open} />
      <Navbar handleDrawerOpen={handleDrawerOpen} open={open} />
      <Main open={open} sx={{ pt: 8, width: '100%', overflow: 'hidden' }}>
        {children}
      </Main>
    </Box>
  );
}

export default Layout;
