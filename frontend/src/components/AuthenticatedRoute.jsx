// src/components/AuthenticatedRoute.jsx

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner.tsx'; // Importe o LoadingSpinner

const AuthenticatedRoute = ({ element: Element }) => {
  const { user, loading } = useAuth();
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    // Configura o temporizador para definir showSpinner como false após 500ms
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 5000); // Ajuste o valor conforme necessário

    // Limpeza do temporizador quando o componente for desmontado
    return () => clearTimeout(timer);
  }, []);

  if (loading || showSpinner) {
    return <LoadingSpinner />; // Exibe o LoadingSpinner enquanto loading ou showSpinner são verdadeiros
  }

  return user ? <Element /> : <Navigate to="/signin" />;
};

export default AuthenticatedRoute;
