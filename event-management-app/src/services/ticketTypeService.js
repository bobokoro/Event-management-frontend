import api from './api';

export const getTicketTypesByEvent = async (eventId) => {
  const response = await api.get(`/events/${eventId}/ticket-types`);
  return response.data;
};

export const createTicketType = async (eventId, data) => {
const response = await api.post(`/events/${eventId}/ticket-types`, data);
return response.data;
};

export const deleteTicketType = async (eventId, ticketTypeId) => {
  await api.delete(`/events/${eventId}/ticket-types/${ticketTypeId}`);

};
