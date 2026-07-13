import {
  IconButton,
  Toolbar,
  styled,
  Box,
  Avatar,
  Typography,
} from '@mui/material';
import React from 'react';
import MuiAppBar, { AppBarProps } from '@mui/material/AppBar';
import { Menu } from '@mui/icons-material';
import { store } from 'redux/store';
import ThemeVariables from 'theme/theme-variables';
import { drawerWidth } from '../sidebar/sidebar.component';
import LogoutButton from '../loguot-button.component';
import LanguageButton from './language-buttom/language-buttom.component';

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<NavbarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface NavbarProps extends AppBarProps {
  open?: boolean;
  handleDrawerOpen?: () => void;
}

function Navbar({ handleDrawerOpen, open }: NavbarProps) {
  const { fullName: userFullName } = store.getState().auth;
  return (
    <AppBar
      elevation={0}
      position="fixed"
      open={open}
      sx={{
        bgcolor: ThemeVariables.PRIMARY_COLOR,
        // backgroundImage: "linear-gradient(45deg, #020691, #169AE0)",
        // backgroundSize: "100%",
        // backgroundRepeat: "repeat",
        // WebkitBackgroundClip: "text",
        // WebkitTextFillColor: "transparent",
        // backgroundClip: "text",
        // textFillColor: "transparent",
        width: '100%',
      }}
    >
      <Toolbar>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mx: 0, ...(open && { display: 'none' }) }}
            >
              <Menu />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography px={1} fontWeight={600}>
                  {userFullName || ''}
                </Typography>
              </Box>
              <Avatar />
            </Box>
            <LogoutButton />
          </Box>
        </Box>
        <Box sx={{ px: 2 }}>
          <LanguageButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
