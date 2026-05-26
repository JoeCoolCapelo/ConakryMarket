import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">

      {/* ══════ MOBILE HEADER ══════ */}
      <div className="lg:hidden relative overflow-hidden" style={{ minHeight: '260px' }}>
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-secondary"></div>
        
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-sm"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/5 blur-sm"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-white/10"></div>
        
        {/* Floating mini images */}
        <img 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=60&w=120"
          alt="" 
          className="absolute top-4 right-4 w-16 h-16 object-cover rounded-xl shadow-lg border-2 border-white/40 rotate-6 opacity-70"
        />
        <img 
          src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=60&w=120"
          alt="" 
          className="absolute bottom-6 left-4 w-14 h-14 object-cover rounded-lg shadow-lg border-2 border-white/40 -rotate-6 opacity-60"
        />
        <img 
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=60&w=120"
          alt="" 
          className="absolute top-8 left-1/4 w-12 h-12 object-cover rounded-full shadow-lg border-2 border-white/30 opacity-50"
        />

        {/* Logo + text */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full py-10 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl mb-4 border-2 border-white/30 bg-white">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-black text-white mb-1">
            Conakry<span className="text-yellow-300">Market</span>
          </h1>
          <p className="text-white/80 text-sm font-medium max-w-xs">
            Connectez-vous pour découvrir les meilleures offres de Guinée.
          </p>
        </div>

        {/* Curved bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,0 C480,60 960,60 1440,0 L1440,60 L0,60 Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* ══════ DESKTOP LEFT COLUMN — Photos (hidden on mobile) ══════ */}
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

      {/* ══════ FORM COLUMN ══════ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8 sm:p-12 lg:p-24 relative">
        <Link to="/" className="absolute top-6 right-6 sm:top-8 sm:right-8 text-sm font-bold text-gray-400 hover:text-primary transition-colors">
          Retour à l'accueil
        </Link>
        
        <div className="max-w-md w-full">
          {/* En-tête */}
          <div className="flex items-center gap-4 mb-8 lg:mb-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <FiLogIn className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Bon retour !</h2>
              <p className="text-gray-500 font-medium text-xs sm:text-sm mt-0.5">Connectez-vous à votre espace personnel.</p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-xs font-black text-gray-700 mb-2 uppercase tracking-widest">Adresse Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400 group-focus-within:text-primary transition-colors" size={17} />
                </div>
                <input
                  type="email" required
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-gray-900 font-semibold text-sm placeholder:font-normal placeholder:text-gray-400"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-black text-gray-700 uppercase tracking-widest">Mot de passe</label>
                <a href="#" className="text-xs font-bold text-primary hover:underline transition-colors">Oublié ?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400 group-focus-within:text-primary transition-colors" size={17} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'} required
                  className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-gray-900 font-semibold text-sm placeholder:font-normal placeholder:text-gray-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary transition-colors">
                  {showPassword ? <FiEyeOff size={17}/> : <FiEye size={17}/>}
                </button>
              </div>
            </div>

            {/* Bouton */}
            <div className="pt-2">
              <button
                type="submit" disabled={loading}
                className="w-full flex justify-center items-center gap-2.5 py-4 px-4 rounded-2xl shadow-lg shadow-primary/30 text-base font-black text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <><FiLogIn size={18} /> Se connecter</>
                )}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-8 lg:mt-10">
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
