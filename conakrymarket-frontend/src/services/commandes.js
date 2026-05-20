import api from './api';

export const createCommande = async (data) => {
  const response = await api.post('/commandes', data);
  return response.data;
};

export const getMesCommandes = async (params) => {
  const response = await api.get('/commandes/mes-commandes', { params });
  return response.data;
};

export const getVendeurCommandes = async (params) => {
  const response = await api.get('/commandes/vendeur', { params });
  return response.data;
};

export const getCommande = async (oid) => {
  const response = await api.get(`/commandes/${oid}`);
  return response.data;
};

export const updateStatut = async (oid, statut) => {
  const response = await api.patch(`/commandes/${oid}/statut`, { statut });
  return response.data;
};
