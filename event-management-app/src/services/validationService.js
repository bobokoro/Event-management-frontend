import api from './api';

export const validateByCode = async (data) => {
    const response = await api.post('/tickets/validate/code', data);
    return response.data;
};

export const validateByQR = async (data) => {
    const response = await api.post('/tickets/validate/qr', data);
    return response.data;
};