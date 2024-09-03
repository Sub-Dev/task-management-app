import React, { createContext, useState, useEffect } from "react";
import { useSnackbar } from "./SnackbarContext.tsx"; // Importe o hook

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(
            "http://localhost:4000/auth/validate-token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            let message =
              "Sua sessão expirou ou foi efetuado o login em outro dispositivo. Faça login novamente.";
            if (errorData.message.includes("expired")) {
              message = "Sua sessão expirou. Faça login novamente.";
            } else if (errorData.message.includes("logged out")) {
              message = "Sua conta foi desconectada em outro dispositivo.";
            }
            throw new Error(message);
          }

          const data = await response.json();
          setUser(data.user);
          setError(null); // Limpar o erro quando a verificação for bem-sucedida
        } catch (error) {
          setUser(null);
          setError(error.message);
          // Exibe o erro no Snackbar apenas se o estado do erro for diferente do atual
          if (error.message !== error) {
            showSnackbar(error.message, "error"); // Exibe o erro no Snackbar
            logout(); // Deslogar o usuário automaticamente
          }
        }
      } else {
        setUser(null);
        setError(null);
      }
      setLoading(false);
    };

    // Verifique o token imediatamente ao carregar o componente
    checkToken();

    // Configurado a verificação periódica do token a cada 5 minutos (300000 milissegundos)
    const intervalId = setInterval(checkToken, 300000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, [showSnackbar]);

  const login = (token, user) => {
    localStorage.setItem("token", token);
    setUser(user);
    setError(null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
