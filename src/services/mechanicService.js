import api from '../configs/api';

export const mechanicService = {
    getServiceTickets: () => api.get('/mechanic/service-tickets'),
    getServiceTicket: (id) => api.get(`/mechanic/service-tickets/${id}`),
    searchServiceTickets: (params) => {
        const queryParams = new URLSearchParams();
        if (params.custID) queryParams.append('custID', params.custID);
        if (params.carID) queryParams.append('carID', params.carID);
        if (params.dateReceived) queryParams.append('dateReceived', params.dateReceived);
        return api.get(`/mechanic/service-tickets/search?${queryParams.toString()}`);
    },
    updateServiceTicket: (id, ticket) => api.put(`/mechanic/service-tickets/${id}`, ticket),
    updateServiceTicketWork: (id, workData) => {
        const queryParams = new URLSearchParams();
        if (workData.hours) queryParams.append('hours', workData.hours);
        if (workData.comment) queryParams.append('comment', workData.comment);
        if (workData.rate) queryParams.append('rate', workData.rate);
        return api.patch(`/mechanic/service-tickets/${id}/update-work?${queryParams.toString()}`);
    },

    getServices: () => api.get('/mechanic/services'),
    createService: (service) => api.post('/mechanic/services', service),
    updateService: (id, service) => api.put(`/mechanic/services/${id}`, service),
    deleteService: (id) => api.delete(`/mechanic/services/${id}`)
};
