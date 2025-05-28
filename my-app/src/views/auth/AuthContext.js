import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('user');

      if (accessToken && storedUser) {
        try {
          const response = await axios.get('http://localhost:8087/auth/validate', {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          });
          const { email, roles } = response.data;
          setUser({ email, roles, accessToken, refreshToken });
        } catch (error) {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            
            const { email, roles } = JSON.parse(storedUser);
            setUser({ email, roles, accessToken: newAccessToken, refreshToken });
          } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const response = await axios.post(
          'http://localhost:8087/auth/refresh',
          { refreshToken },
          { withCredentials: true }
        );
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        return accessToken;
      } catch (error) {
        console.error('Échec du rafraîchissement du token:', error);
        return null;
      }
    }
    return null;
  };

  // Fonction pour rafraîchir le token, accessible via le contexte
  const refreshTokenIfNeeded = async () => {
    if (!user?.refreshToken) return false;
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      setUser({ ...user, accessToken: newAccessToken });
      return true;
    } else {
      logout();
      return false;
    }
  };

  const login = async (email, motdepasse) => {
    try {
      const response = await axios.post(
        'http://localhost:8087/auth/login',
        { email, password: motdepasse },
        { withCredentials: true }
      );
      const { roles, email: userEmail, accessToken, refreshToken } = response.data;

      const userData = { email: userEmail, roles, accessToken, refreshToken };
      setUser(userData);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify({ email: userEmail, roles }));

      return {
        accessToken,
        refreshToken,
        isActive: true,
        roles,
        user: { email: userEmail },
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la connexion');
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:8087/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshTokenIfNeeded }}>
      {children}
    </AuthContext.Provider>
  );
};