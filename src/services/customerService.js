import api from '../configs/api';

export const customerService = {
    getServiceTickets: () => api.get('/customer/service-tickets'),
    getServiceTicket: (id) => api.get(`/customer/service-tickets/${id}`),

    getInvoices: () => api.get('/customer/invoices'),
    getInvoice: (id) => api.get(`/customer/invoices/${id}`),

    getProfile: () => api.get('/customer/profile'),
    updateProfile: (profile) => api.put('/customer/profile', profile)
};
