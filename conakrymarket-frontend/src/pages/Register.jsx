import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiUser, FiMail, FiPhone, FiLock, FiMapPin, FiCalendar, FiArrowRight, FiShoppingBag, FiBriefcase } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    mot_de_passe: '',
    ville: 'Conakry',
    age: '',
    role: 'client'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        ...formData,
        age: parseInt(formData.age, 10)
      });
      navigate('/');
    } catch (error) {
      // Error handled by hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-gray-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white p-8 md:p-12 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-accent-dark">Rejoignez-nous</h2>
          <p className="mt-2 text-gray-500">Créez votre compte en quelques secondes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Je souhaite m'inscrire en tant que :</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleRoleChange('client')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  formData.role === 'client' 
                  ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <FiShoppingBag size={24} />
                <span className="font-bold">Client</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('vendeur')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  formData.role === 'vendeur' 
                  ? 'border-secondary bg-secondary/5 text-secondary shadow-sm' 
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <FiBriefcase size={24} />
                <span className="font-bold">Vendeur</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nom complet</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="nom"
                  required
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Jean Dupont"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="jean@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone</label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="telephone"
                  required
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="620 00 00 00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="mot_de_passe"
                  required
                  minLength={6}
                  value={formData.mot_de_passe}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ville</label>
              <div className="relative">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  name="ville"
                  required
                  value={formData.ville}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                >
                  <option value="Conakry">Conakry</option>
                  <option value="Kindia">Kindia</option>
                  <option value="Labé">Labé</option>
                  <option value="Kankan">Kankan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Âge</label>
              <div className="relative">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="age"
                  required
                  min={18}
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="25"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/30 text-lg font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 mt-8"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>Créer mon compte <FiArrowRight /></>
            )}
          </button>
        </form>

        <div className="text-center mt-8 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Déjà inscrit ?{' '}
            <Link to="/connexion" className="font-bold text-primary hover:text-primary-dark transition-colors">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
