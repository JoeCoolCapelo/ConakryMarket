import api from './api';

export const createAvis = async (pid, data) => {
  const response = await api.post(`/produits/${pid}/avis`, data);
  return response.data;
};

export const getAvisProduit = async (pid) => {
  const response = await api.get(`/produits/${pid}/avis`);
  return response.data;
};

export const incrementUtile = async (pid, avisId) => {
  const response = await api.patch(`/produits/${pid}/avis/${avisId}/utile`);
  return response.data;
};
