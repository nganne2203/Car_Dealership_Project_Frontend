import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const userInfo = authService.getCurrentUser();
    if (userInfo && authService.isAuthenticated()) {
      setUser(userInfo);
    }
    setLoading(false);
  }, []);

  const login = async (credentials, isCustomer = false) => {
    let response;
    if (isCustomer) {
      response = await authService.customerLogin(credentials);
    } else {
      response = await authService.login(credentials);
    }
    
    const userInfo = authService.getCurrentUser();
    setUser(userInfo);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: authService.isAuthenticated(),
    userRole: authService.getUserRole()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
