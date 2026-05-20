import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Determine the error message
    const message = error.response?.data?.message || 'Une erreur inattendue est survenue.';
    
    if (error.response) {
      // 401 Unauthorized: Session expirée ou invalide
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Avoid spamming toasts if multiple requests fail at once
        if (!toast.isActive('unauthorized')) {
          toast.error('Session expirée. Veuillez vous reconnecter.', { id: 'unauthorized' });
        }
        
        // Redirection vers la page de connexion si on n'y est pas déjà
        if (window.location.pathname !== '/connexion') {
          setTimeout(() => {
            window.location.href = '/connexion';
          }, 1000);
        }
      } 
      // 403 Forbidden: Droits insuffisants
      else if (error.response.status === 403) {
        toast.error('Vous n\'avez pas la permission d\'effectuer cette action.');
      }
      // 400 Bad Request / 404 Not Found
      else if (error.response.status === 400 || error.response.status === 404) {
        toast.error(message);
      }
      // 500 Internal Server Error
      else if (error.response.status >= 500) {
        toast.error('Erreur serveur. Veuillez réessayer plus tard.');
      }
    } else if (error.request) {
      // Problème réseau (le backend ne répond pas)
      toast.error('Impossible de contacter le serveur. Vérifiez votre connexion internet.');
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
