import { useSelector, useDispatch } from 'react-redux';
import { setCredentials, logout as logoutAction, updateUser } from '../store/authSlice';
import { login as loginService, register as registerService, updateProfile as updateProfileService } from '../services/auth';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const { user } = useSelector((state) => state.auth);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const isVendeur = user?.role === 'vendeur';
  const isAdmin = user?.role === 'admin';

  const login = async (credentials) => {
    try {
      const data = await loginService(credentials);
      dispatch(setCredentials({ user: data.user, token: data.token }));
      toast.success('Connexion réussie');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur de connexion');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await registerService(userData);
      dispatch(setCredentials({ user: data.user, token: data.token }));
      toast.success('Inscription réussie');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'inscription');
      throw error;
    }
  };

  const updateProfile = async (userData) => {
    try {
      const data = await updateProfileService(userData);
      dispatch(updateUser(data.user));
      toast.success('Profil mis à jour');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
      throw error;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    toast.success('Déconnecté');
  };

  return {
    user,
    isAuthenticated,
    isVendeur,
    isAdmin,
    login,
    logout,
    register,
    updateProfile,
  };
};
