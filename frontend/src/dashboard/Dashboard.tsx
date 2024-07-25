import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { mainListItems, secondaryListItems } from './components/listItems.tsx';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Orders from './components/Orders.tsx';
import LogoNoBackground from '../img/logo-no-background.png';
import Avatar1 from '../img/avatar/1.jpg';
import { colors } from '@mui/material';
import Copyright from '../Copyright.tsx';
import Kanban from './components/Kanban.tsx';
import UserProfile from './components/UserProfile.tsx';

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: drawerWidth,
        [theme.breakpoints.up('sm')]: {
          width: drawerWidth,
        },
      }),
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Define a função de navegação para a página de perfil
  const navigate = useNavigate();

  const handleNavigateToProfile = () => {
    navigate('/dashboard/profile'); // Redireciona para a rota de perfil
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open} sx={{ backgroundColor: '#1b222a', color: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <Toolbar sx={{ pr: '24px' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Dashboard
            </Typography>
            <IconButton color="inherit" sx={{ mr: '10px' }}>
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton>
              <Avatar alt="Remy Sharp" src={Avatar1} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              backgroundColor: '#1b222a',
              borderBottom: 'none',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={LogoNoBackground}
                alt="Logo"
                style={{
                  width: 60,
                  height: 60,
                  marginRight: 16,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.1)' },
                }}
              />
              <Typography variant="h6" color="white" sx={{ fontWeight: 'bold' }}>TaskMaster</Typography>
            </Box>
            <IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider sx={{ height: '1px', backgroundColor: '#335' }} />
          {/* Conditional rendering of the avatar and user info */}
          {open && (
            <Box sx={{ p: 2, color: '#707070', textAlign: 'center' }}>
              <Avatar
                alt="Remy Sharp"
                src={Avatar1}
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 1,
                  border: `2px solid ${colors.grey[500]}`,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Remy Sharp</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <IconButton sx={{ color: colors.grey[400] }} onClick={handleNavigateToProfile}>
                  <SettingsIcon />
                </IconButton>
                <IconButton sx={{ color: colors.grey[400] }}>
                  <LogoutIcon />
                </IconButton>
              </Box>
            </Box>
          )}
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '90vh',
            overflow: 'auto',
            p: 3,
          }}
        >
          <Toolbar />
          <Routes>
            <Route path="/" element={<Orders />} />
            <Route path="/kanban" element={<Kanban sidebarOpen={open} />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </Box>
      </Box>
      <Box
        component="footer"
        sx={{
          py: 2.7,
          px: 2,
          mt: 'auto',
          backgroundColor: '#1b222a',
          width: '100%',
          position: 'relative',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Copyright sx={{ pt: 2, color: 'white' }} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
