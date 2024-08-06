// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se há um token armazenado no localStorage ao carregar o app
    const token = localStorage.getItem('token');
    if (token) {
      // Faz a validação do token com o backend
      fetch('http://localhost:4000/auth/validate-token', {
        method: 'POST', // Use o método POST para enviar o token
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Envie o token no cabeçalho Authorization
        },
        // Remova o corpo da requisição
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Falha na validação do token');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Dados do usuário:', data);
          setUser(data.user); // Atualize o estado do usuário com os dados retornados
          setLoading(false);
        })
        .catch((error) => {
          console.error('Erro:', error);
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    console.log(localStorage.getItem('token'));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
