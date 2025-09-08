import api from '../configs/api';

export const salespersonService = {
    getCustomers: () => api.get('/salesperson/customers'),
    createCustomer: (customer) => api.post('/salesperson/customers', customer),
    updateCustomer: (id, customer) => api.put(`/salesperson/customers/${id}`, customer),
    deleteCustomer: (id) => api.delete(`/salesperson/customers/${id}`),
    searchCustomers: (name) => api.get(`/salesperson/customers/search?name=${encodeURIComponent(name)}`),

    getCars: () => api.get('/salesperson/cars'),
    createCar: (car) => api.post('/salesperson/cars', car),
    updateCar: (id, car) => api.put(`/salesperson/cars/${id}`, car),
    deleteCar: (id) => api.delete(`/salesperson/cars/${id}`),
    searchCars: (params) => {
        const queryParams = new URLSearchParams();
        if (params.serialNumber) queryParams.append('serialNumber', params.serialNumber);
        if (params.model) queryParams.append('model', params.model);
        if (params.year) queryParams.append('year', params.year);
        return api.get(`/salesperson/cars/search?${queryParams.toString()}`);
    },

    getServiceTickets: () => api.get('/salesperson/service-tickets'),
    createServiceTicket: (ticket) => api.post('/salesperson/service-tickets', ticket),
    getServiceTicket: (id) => api.get(`/salesperson/service-tickets/${id}`),

    getParts: () => api.get('/salesperson/parts'),
    createPart: (part) => api.post('/salesperson/parts', part),
    updatePart: (id, part) => api.put(`/salesperson/parts/${id}`, part),
    deletePart: (id) => api.delete(`/salesperson/parts/${id}`),
    searchParts: (partName) => api.get(`/salesperson/parts/search?partName=${encodeURIComponent(partName)}`),

    getInvoices: () => api.get('/salesperson/invoices'),
    createInvoice: (invoice) => api.post('/salesperson/invoices', invoice),

    getCarsSoldByYear: () => api.get('/salesperson/reports/cars-sold-by-year'),
    getCarSalesRevenueByYear: () => api.get('/salesperson/reports/car-sales-revenue-by-year'),
    getBestSellingCarModels: () => api.get('/salesperson/reports/best-selling-car-models'),
    getBestUsedParts: () => api.get('/salesperson/reports/best-used-parts'),
    getTopMechanics: () => api.get('/salesperson/reports/top-mechanics')
};
