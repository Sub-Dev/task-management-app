import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './homepage/LandingPage.tsx';
import SignIn from './sign-in/SignIn.tsx';
import SignUp from './sign-up/SignUp.tsx';
import Dashboard from './dashboard/Dashboard.tsx';
// import NotFound from './components/NotFound';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
