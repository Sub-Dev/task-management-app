import * as React from 'react';
import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoNoBackground from '../../img/logo-no-background.png';

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundImage:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #CEE5FD, #FFF)'
            : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
        backgroundSize: '100% 20%',
        backgroundRepeat: 'no-repeat',
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <img
          src={LogoNoBackground}
          alt="TaskMaster logo"
          style={{
            width: '200px',
            height: 'auto',
            filter: 'drop-shadow(0 0 15px rgba(0, 0, 0, 0.9))',
          }}
        />
        <Stack
          spacing={2}
          useFlexGap
          sx={{ width: { xs: '100%', sm: '70%' }, textAlign: 'center' }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: 'clamp(3.5rem, 10vw, 4rem)',
              color: (theme) =>
                theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
            }}
          >
            Welcome to&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: 'clamp(3rem, 10vw, 4rem)',
                color: (theme) =>
                  theme.palette.mode === 'light' ? '#1b222a' : 'white',
              }}
            >
              TaskMaster
            </Typography>
          </Typography>
          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ width: { sm: '100%', md: '80%' } }}
          >
            TaskMaster is your ultimate task management solution. Streamline your workflow, stay organized, and enhance productivity with our cutting-edge features.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignSelf="center"
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
          >
            <Button
              variant="contained"
              color="primary"
              component="a"
              href="/signup"
            >
              Get Started
            </Button>
          </Stack>
        </Stack>
        <Box
          sx={{
            mt: { xs: 8, sm: 10 },
            width: '100%',
            textAlign: 'center',
          }}
        >

        </Box>
      </Container>
    </Box>
  );
}
