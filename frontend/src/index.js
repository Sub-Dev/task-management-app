import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './homepage/LandingPage.tsx';
import SignIn from './sign-in/SignIn.tsx';
import SignUp from './sign-up/SignUp.tsx';
import Dashboard from './dashboard/Dashboard.tsx';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import { AuthProvider } from './context/AuthContext';
import NotFound from './components/NotFound.tsx';
import { SnackbarProvider } from './context/SnackbarContext.tsx';
import { ThemeProvider } from '@mui/material/styles';
import theme from './fonts/Theme.tsx';
import { UserProvider } from './context/UserContext.tsx';
import { ProjectProvider } from './context/ProjectContext.tsx';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <SnackbarProvider>
          <AuthProvider>
            <UserProvider>
              <ProjectProvider>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/dashboard/*" element={<AuthenticatedRoute element={Dashboard} />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ProjectProvider>
            </UserProvider>
          </AuthProvider>
        </SnackbarProvider>
      </Router>
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
