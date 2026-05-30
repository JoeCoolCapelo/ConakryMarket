import api from './api';

export const getGlobalStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const deleteUser = async (uid) => {
  const response = await api.delete(`/admin/users/${uid}`);
  return response.data;
};

export const getAllCommandes = async () => {
  const response = await api.get('/admin/commandes');
  return response.data;
};

export const getAdminCACategories = async () => {
  const response = await api.get('/admin/ca-categories');
  return response.data;
};

export const getAdminTopProduits = async () => {
  const response = await api.get('/admin/top-produits');
  return response.data;
};

export const getAdminCAVilles = async () => {
  const response = await api.get('/admin/ca-villes');
  return response.data;
};

export const getAdminEvolutionMensuelle = async () => {
  const response = await api.get('/admin/evolution-mensuelle');
  return response.data;
};

export const getAdminStockCritique = async () => {
  const response = await api.get('/admin/stock-critique');
  return response.data;
};

export const getAdminTopVendeurs = async () => {
  const response = await api.get('/admin/top-vendeurs');
  return response.data;
};

// ─── Abonnements ──────────────────────────────────────────────────────────────
export const getStatsAbonnements = async () => {
  const response = await api.get('/abonnements/stats');
  return response.data;
};

export const getAllAbonnements = async (params = {}) => {
  const response = await api.get('/abonnements', { params });
  return response.data;
};

export const enregistrerPaiement = async (data) => {
  const response = await api.post('/abonnements/paiement', data);
  return response.data;
};

export const getVendeursSansAbonnement = async () => {
  const response = await api.get('/abonnements/sans-abonnement');
  return response.data;
};

export const bloquerVendeur = async (vendeur_uid) => {
  const response = await api.put(`/abonnements/bloquer/${vendeur_uid}`);
  return response.data;
};
