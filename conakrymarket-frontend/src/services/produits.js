import api from './api';

export const getProduits = async (params) => {
  const response = await api.get('/produits', { params });
  return response.data;
};

export const getProduit = async (pid) => {
  const response = await api.get(`/produits/${pid}`);
  return response.data;
};

export const createProduit = async (data) => {
  const response = await api.post('/produits', data);
  return response.data;
};

export const updateProduit = async (pid, data) => {
  const response = await api.put(`/produits/${pid}`, data);
  return response.data;
};

export const deleteProduit = async (pid) => {
  const response = await api.delete(`/produits/${pid}`);
  return response.data;
};

export const uploadImages = async (pid, formData) => {
  const response = await api.post(`/produits/${pid}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
