import api from './api';

export const initializePayment = async (data) => {
    const response = await api.post('/payments/initialize', data);
    return response.data;
};

export const verifyPayment = async (reference) => {
    const response = await api.get(`/payments/verify/${reference}`);
    return response.data;
};

export const getMyPayments = async () => {
    const response = await api.get('/payments/my-payments');
    return response.data;
};