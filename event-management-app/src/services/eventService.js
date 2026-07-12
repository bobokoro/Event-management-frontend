import  api from './api';

export const getAllEvents = async ()=>{
  const response = await api.get('/events');
  return response.data;
};

export const getEventById = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
  };

export const createEvent = async (data) => {
  const response = await api.post('/events', data);
  return response.data;
};

export const updateEvent = async(id, data) => {
  const response = await api.put(`/events/${id}`, data);
  return response.data;
};

export const deleteEvent = async (id) => {
  await api.delete(`/events/${id}`);  
};

export const getAllPublicEvents = async () => {
    const response = await api.get('/events/public');
    return response.data;
};

export const searchEvents = async (keyword, status) => {
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (status) params.append('status', status);
    const response = await api.get(`/events/search?${params.toString()}`);
    return response.data;
};
