import api from './api';

export const createAvis = async (pid, data) => {
  const response = await api.post('/avis', { pid, ...data });
  return response.data;
};

export const getAvisProduit = async (pid) => {
  const response = await api.get(`/avis/produit/${pid}`);
  return response.data;
};

export const incrementUtile = async (pid, avisId) => {
  const response = await api.patch(`/avis/${avisId}/utile`);
  return response.data;
};
