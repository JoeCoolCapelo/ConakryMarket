import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, mot_de_passe: password });
      navigate('/');
    } catch (error) {
      // Error handled by hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Colonne Gauche - Photos Dispersées (Cachée sur mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-50 overflow-hidden items-center justify-center">
        {/* Fond décoratif */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/10"></div>
        
        {/* Grille de photos asymétrique */}
        <div className="relative w-full h-full max-w-2xl">
          {/* Vêtements */}
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=400" 
            className="absolute top-[15%] left-[10%] w-48 h-64 object-cover rounded-2xl shadow-2xl -rotate-6 border-4 border-white transition-transform hover:scale-105 hover:rotate-0 duration-500" 
            alt="Mode" 
          />
          {/* Électronique */}
          <img 
            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=400" 
            className="absolute top-[20%] right-[15%] w-56 h-56 object-cover rounded-3xl shadow-xl rotate-3 border-4 border-white transition-transform hover:scale-105 hover:rotate-0 duration-500" 
            alt="Électronique" 
          />
          {/* Alimentation / Marché */}
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=500" 
            className="absolute bottom-[20%] left-[15%] w-72 h-48 object-cover rounded-2xl shadow-2xl rotate-2 border-4 border-white transition-transform hover:scale-105 hover:rotate-0 duration-500" 
            alt="Alimentation" 
          />
          {/* Équipement Agricole / Autre */}
          <img 
            src="https://images.unsplash.com/photo-1592982537447-6f29cb91a4af?auto=format&fit=crop&q=80&w=400" 
            className="absolute bottom-[10%] right-[15%] w-40 h-40 object-cover rounded-full shadow-lg -rotate-12 border-4 border-white transition-transform hover:scale-105 hover:rotate-0 duration-500" 
            alt="Agriculture" 
          />
          
          {/* Badge central */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl text-center max-w-sm border border-gray-100">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden shadow-sm">
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Conakry<span className="text-primary">Market</span></h3>
              <p className="text-sm font-medium text-gray-600">Connectez-vous pour découvrir les meilleures offres de Guinée.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Colonne Droite - Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <Link to="/" className="absolute top-8 right-8 text-sm font-bold text-gray-400 hover:text-primary transition-colors">
          Retour à l'accueil
        </Link>
        
        <div className="max-w-md w-full space-y-8">
          <div className="text-left">
            <h2 className="text-4xl font-black text-gray-900">Bon retour ! 👋</h2>
            <p className="mt-3 text-gray-500 font-medium">Connectez-vous pour accéder à votre espace personnel.</p>
          </div>
          
          <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Adresse Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 font-medium"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-900">Mot de passe</label>
                  <a href="#" className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">Mot de passe oublié ?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl shadow-lg shadow-primary/30 text-lg font-black text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 mt-8"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Se connecter <FiArrowRight size={20} /></>
              )}
            </button>
          </form>
          
          <div className="text-center mt-10">
            <p className="text-sm font-medium text-gray-600">
              Pas encore de compte ?{' '}
              <Link to="/inscription" className="font-black text-primary hover:text-primary-dark transition-colors">
                Créer un compte
              </Link>
            </p>
          </div>

          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <Link to="/admin/login" className="text-xs font-bold text-gray-400 hover:text-purple-600 transition-colors flex items-center justify-center gap-1">
              <FiLock size={12} /> Accès Back-Office Sécurisé
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
