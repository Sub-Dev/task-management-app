import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './homepage/LandingPage.tsx';
import SignIn from './sign-in/SignIn.tsx';
import SignUp from './sign-up/SignUp.tsx';
import Dashboard from './dashboard/Dashboard.tsx';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import { AuthProvider } from './context/AuthContext'; // Importa o AuthProvider
import NotFound from './components/NotFound.tsx';
import { SnackbarProvider } from './context/SnackbarContext.tsx';
import { ThemeProvider } from '@mui/material/styles';
import theme from './fonts/Theme.tsx';

const App = () => {
  return (
    <ThemeProvider theme={theme}> {/* Envolva toda a aplicação com o ThemeProvider */}
      <Router>
        <SnackbarProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard/*" element={<AuthenticatedRoute element={Dashboard} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </SnackbarProvider>
      </Router>
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
