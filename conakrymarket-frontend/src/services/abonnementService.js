import api from './api';

const abonnementService = {
  // Payer (simuler un paiement) pour activer/renouveler l'abonnement
  payerAbonnement: async (abonnementData) => {
    const response = await api.post('/abonnements/payer', abonnementData);
    return response.data;
  },

  // Récupérer les informations de l'abonnement du vendeur connecté
  getMonAbonnement: async () => {
    const response = await api.get('/abonnements/mon-abonnement');
    return response.data;
  },

  // --- Routes Admin ---
  getStats: async () => {
    const response = await api.get('/abonnements/stats');
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/abonnements');
    return response.data;
  },

  bloquerVendeur: async (uid) => {
    const response = await api.put(`/abonnements/bloquer/${uid}`);
    return response.data;
  },

  debloquerVendeur: async (uid) => {
    const response = await api.put(`/abonnements/debloquer/${uid}`);
    return response.data;
  }
};

export default abonnementService;
