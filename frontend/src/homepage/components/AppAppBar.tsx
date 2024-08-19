import * as React from 'react';
import { PaletteMode } from '@mui/material';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import ToggleColorMode from './ToggleColorMode.tsx';
import LogoNoBackground from '../../img/logo-no-background.png';

const logoStyle = {
  width: '90px',
  height: 'auto',
  cursor: 'pointer',
  filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.8))',
  transition: 'filter 0.3s ease',
};

const logoHoverStyle = {
  ...logoStyle,
  filter: 'drop-shadow(0 0 12px rgba(0, 0, 0, 1))',
};

const textStyle = {
  fontWeight: 600,
  color: 'text.primary',
  marginLeft: '8px',
  marginRight: '10px',
  cursor: 'pointer',
  transition: 'color 0.3s ease',
};

const textHoverStyle = {
  ...textStyle,
  color: 'primary.main',
};

const AppBarContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: '12px',
  backdropFilter: 'blur(12px)',
  maxHeight: 70,
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2))',
};

interface AppAppBarProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

function AppAppBar({ mode, toggleColorMode }: AppAppBarProps) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
      setOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={AppBarContainer}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                px: 0,
              }}
            >
              <img
                src={LogoNoBackground}
                style={logoStyle}
                onMouseOver={(e) => (e.currentTarget.style.filter = logoHoverStyle.filter)}
                onMouseOut={(e) => (e.currentTarget.style.filter = logoStyle.filter)}
                alt="Logo TaskMaster"
                onClick={scrollToTop}
              />
              <Typography
                variant="h6"
                sx={textStyle}
                onMouseOver={(e) => (e.currentTarget.style.color = textHoverStyle.color)}
                onMouseOut={(e) => (e.currentTarget.style.color = textStyle.color)}
                onClick={scrollToTop}
              >
                TaskMaster
              </Typography>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <MenuItem
                  onClick={() => scrollToSection('features')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    Funcionalidades
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection('highlights')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    Destaques
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection('faq')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    FAQ
                  </Typography>
                </MenuItem>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center',
              }}
            >
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
              <Button
                color="primary"
                variant="outlined"
                size="small"
                component="a"
                href="/signin"
                target="_blank"
              >
                Entrar
              </Button>
              <Button
                color="primary"
                variant="contained"
                size="small"
                component="a"
                href="/signup"
                target="_blank"
              >
                Registrar
              </Button>
            </Box>
            <Box sx={{ display: { sm: '', md: 'none' } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: '30px', p: '4px' }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: '60dvw',
                    p: 2,
                    backgroundColor: 'background.paper',
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'end',
                      flexGrow: 1,
                    }}
                  >
                    <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
                  </Box>
                  <MenuItem onClick={() => scrollToSection('features')}>
                    Funcionalidades
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection('highlights')}>
                    Destaques
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection('faq')}>
                    FAQ
                  </MenuItem>
                  <Divider />
                  <MenuItem>
                    <Button
                      color="primary"
                      variant="contained"
                      component="a"
                      href="/signup"
                      target="_blank"
                      sx={{ width: '100%' }}
                    >
                      Registrar
                    </Button>
                  </MenuItem>
                  <MenuItem>
                    <Button
                      color="primary"
                      variant="outlined"
                      component="a"
                      href="/signin"
                      target="_blank"
                      sx={{ width: '100%' }}
                    >
                      Entrar
                    </Button>
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

export default AppAppBar;
