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
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { MainListItems, SecondaryListItems } from './components/ListItemsDashboard.tsx';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Orders from './components/Projects.tsx';
import LogoNoBackground from '../img/logo-no-background.png';
import Avatar1 from '../img/avatar/1.png';
import { colors } from '@mui/material';
import Copyright from '../Copyright.tsx';
import Kanban from './components/Kanban.tsx';
import UserProfile from './components/UserProfile.tsx';
import { jwtDecode } from 'jwt-decode';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import HomeDashboard from './components/HomeDashboard.tsx';
import backgroundImage from '../img/background-image.jpg';
import { useUser } from '../context/UserContext.tsx';

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
      overflowX: 'hidden',
      ...(open && {
        width: drawerWidth,
        [theme.breakpoints.up('sm')]: {
          width: drawerWidth,
        },
      }),
      ...(!open && {
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
  const { user, setUser } = useUser();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const location = useLocation();
  const navigate = useNavigate();
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.sub;

      fetch(`http://localhost:4000/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          setUser({
            name: data.username,
            email: data.email,
            password: '',
            profileImage: data.profileImageUrl,
          });
        })
        .catch(error => {
          console.error('Erro ao buscar os dados do usuário:', error);
        });
    }
  }, [setUser]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const getTitle = () => {
    const pathArray = location.pathname.split('/');
    let path = pathArray.pop();

    if (path && !isNaN(Number(path))) {
      path = pathArray.pop();
    }

    if (path) {
      return path.charAt(0).toUpperCase() + path.slice(1);
    }

    return 'Dashboard';
  };

  if (!user) {
    return <p>Carregando...</p>;
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleNavigateToProfile = () => {
    navigate('/dashboard/profile');
  };
  const handleLogout = async () => {
    const token = localStorage.getItem('token');


    await fetch('http://localhost:4000/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    localStorage.removeItem('token');

    window.location.reload();

    navigate('/signin');
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open} sx={{ backgroundColor: '#2C3E50', color: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
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
              {getTitle()}
            </Typography>
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={openMenu ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? 'true' : undefined}
            >
              <Avatar alt={user.name} src={user.profileImage || Avatar1} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={openMenu}
              onClose={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  ml: 0,
                  mr: 0,
                  px: 0,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleNavigateToProfile}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Editar Perfil
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Sair
              </MenuItem>
            </Menu>

          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={open}
        >
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              backgroundColor: '#2C3E50',
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
              <Typography variant="h6" color="white" sx={{ fontWeight: 'bold' }}>
                TaskMaster
              </Typography>
            </Box>
            <IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>

          <Divider sx={{ height: '1px', backgroundColor: '#335' }} />

          {open && (
            <Box sx={{ p: 2, color: '#707070', textAlign: 'center', backgroundColor: '#2C3E50' }}>
              <Avatar
                alt={user.name}
                src={user.profileImage || Avatar1}
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 1,
                  border: `2px solid ${colors.grey[500]}`,
                }}
              />
              <Typography variant="h6" color="white" sx={{ fontWeight: 'bold' }}>
                {user.name}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <IconButton sx={{ color: '#3498DB' }} onClick={handleNavigateToProfile}>
                  <SettingsIcon />
                </IconButton>
                <IconButton sx={{ color: '#3498DB' }} onClick={handleLogout}>
                  <LogoutIcon />
                </IconButton>
              </Box>
            </Box>
          )}

          <Divider sx={{ height: '1px', backgroundColor: '#335' }} />

          <List component="nav" sx={{ backgroundColor: '#2C3E50', flexGrow: 1, overflow: 'auto' }}>
            <MainListItems open={open} />
            <SecondaryListItems open={open} />
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            position: 'relative',
            minHeight: '100vh',
            flexGrow: 1,
            overflow: 'auto',
            p: 3,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.5,
              zIndex: -1,
              width: '100%',
              height: '100%',
            },
          }}
        >
          <Toolbar />
          <Routes>
            <Route path="/" element={<HomeDashboard />} />
            <Route path="/projects" element={<Orders />} />
            <Route path="/kanban/:id" element={<Kanban sidebarOpen={open} />} />
            <Route path="/profile" element={<UserProfile open={open} />} />
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
          <Copyright sx={{ pt: 1, color: 'white' }} />
        </Container>
      </Box>
    </ThemeProvider>

  );
}
