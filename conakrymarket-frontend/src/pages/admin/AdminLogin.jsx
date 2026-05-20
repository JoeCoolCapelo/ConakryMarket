import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiShield } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const AdminLogin = () => {
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
      navigate('/admin/dashboard');
    } catch (error) {
      // Erreur gérée par le hook useAuth
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-md w-full space-y-8 bg-gray-800/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-gray-700 relative z-10">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-purple-500/20 text-purple-500 rounded-2xl flex items-center justify-center mb-6">
            <FiShield size={32} />
          </div>
          <h2 className="text-3xl font-black text-white">Administration</h2>
          <p className="mt-2 text-gray-400">Accès restreint au Back-Office</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Email Administrateur</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-white placeholder-gray-600"
                  placeholder="admin@conakrymarket.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-gray-300">Mot de passe</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-white placeholder-gray-600"
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
            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-purple-500/30 text-lg font-bold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>Connexion Sécurisée <FiArrowRight /></>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-gray-700">
          <Link to="/connexion" className="text-xs font-bold text-gray-500 hover:text-gray-300 transition-colors">
            &larr; Retour au site public
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
