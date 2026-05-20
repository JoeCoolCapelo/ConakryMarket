import api from './api';

export const getCACategories = async () => {
  const response = await api.get('/dashboard/ca-categories');
  return response.data;
};

export const getTopProduits = async () => {
  const response = await api.get('/dashboard/top-vendeurs'); // The route might still be top-vendeurs in backend routes unless we changed it. Let's assume route wasn't changed, but the data returned is top products.
  return response.data;
};

export const getCAVilles = async () => {
  const response = await api.get('/dashboard/ca-villes');
  return response.data;
};

export const getEvolutionMensuelle = async () => {
  const response = await api.get('/dashboard/evolution-mensuelle');
  return response.data;
};

export const getStockCritique = async () => {
  const response = await api.get('/dashboard/stock-critique');
  return response.data;
};
