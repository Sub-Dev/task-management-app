import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiPaginationItem: {
      styleOverrides: {
        icon: {
          color: '#3498DB !important',
        },
        root: {
          color: '#3498DB',
        },
      },
    },
  },
});

export default theme;
