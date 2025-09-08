import api from '../configs/api';

export const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        const { token, role, userId, username } = response.data;
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userInfo', JSON.stringify({
        userId,
        username,
        role
        }));
        
        return response.data;
    },

  // Customer login (name + phone)
  customerLogin: async (credentials) => {
    // For customer login, send username and phone (no password)
    const response = await api.post('/auth/login', {
      username: credentials.name,
      phone: credentials.phone
    });
    
    const { token, role, userId, username } = response.data;
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userInfo', JSON.stringify({
      userId,
      username,
      role
    }));
    
    return response.data;
  },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
    },

    getCurrentUser: () => {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    },

    getUserRole: () => {
        return localStorage.getItem('userRole');
    },

    initializeData: async () => {
        const response = await api.post('/auth/init-data');
        return response.data;
    }
};
