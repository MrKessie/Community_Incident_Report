import api from './axios';

export const mapApi = {
  getPublicMapIncidents: () => api.get('/map/incidents'),
};
