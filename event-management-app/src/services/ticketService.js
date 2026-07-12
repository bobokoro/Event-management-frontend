import api from './api';

export const getMyTickets = async () => {
    const response = await api.get('/tickets/my-tickets');
    return response.data;
};

export const getTicketById = async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
};