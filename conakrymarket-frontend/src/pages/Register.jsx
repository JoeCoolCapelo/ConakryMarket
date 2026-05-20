import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiUser, FiMail, FiPhone, FiLock, FiMapPin, FiCalendar, FiArrowRight, FiShoppingCart, FiBriefcase, FiCheckCircle } from 'react-icons/fi';

const VILLES = ['Conakry', 'Kindia', 'Labé', 'Kankan', 'Mamou', 'Nzérékoré', 'Boké', 'Faranah'];

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
      await register({ ...formData, age: parseInt(formData.age, 10) });
      navigate('/');
    } catch (error) {
      // Error handled by hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* ════ COLONNE GAUCHE — Visuels ════ */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-gray-50 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/10"></div>

        {/* Grille photos asymétrique */}
        <div className="relative w-full h-full">
          {/* Grande photo haut-gauche */}
          <img
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=500"
            className="absolute top-[6%] left-[8%] w-52 h-72 object-cover rounded-3xl shadow-2xl -rotate-3 border-4 border-white hover:rotate-0 hover:scale-105 transition-all duration-500"
            alt="Mode Afrique"
          />
          {/* Photo haut-droit */}
          <img
            src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=400"
            className="absolute top-[8%] right-[10%] w-44 h-44 object-cover rounded-2xl shadow-xl rotate-6 border-4 border-white hover:rotate-0 hover:scale-105 transition-all duration-500"
            alt="Électronique"
          />
          {/* Photo centre-gauche */}
          <img
            src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80&w=500"
            className="absolute top-[40%] left-[5%] w-48 h-56 object-cover rounded-3xl shadow-2xl rotate-2 border-4 border-white hover:rotate-0 hover:scale-105 transition-all duration-500"
            alt="Alimentation"
          />
          {/* Photo bas-droit arrondie */}
          <img
            src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400"
            className="absolute bottom-[18%] right-[8%] w-52 h-40 object-cover rounded-2xl shadow-xl -rotate-4 border-4 border-white hover:rotate-0 hover:scale-105 transition-all duration-500"
            alt="Commerce"
          />
          {/* Photo bas-gauche ronde */}
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300"
            className="absolute bottom-[8%] left-[15%] w-36 h-36 object-cover rounded-full shadow-lg border-4 border-white hover:scale-105 transition-all duration-500"
            alt="Marché"
          />

          {/* Badge central flottant */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md p-7 rounded-3xl shadow-2xl text-center max-w-xs border border-gray-100 mx-8">
              <div className="w-14 h-14 mx-auto mb-3 rounded-xl overflow-hidden shadow-sm">
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Conakry<span className="text-primary">Market</span></h3>
              <p className="text-xs font-medium text-gray-500 leading-relaxed">Rejoignez des milliers de vendeurs et clients actifs sur la plateforme n°1 de Guinée.</p>
              <div className="mt-4 space-y-2 text-left">
                {['Inscription gratuite', 'Paiement sécurisé', 'Livraison partout en Guinée'].map(txt => (
                  <div key={txt} className="flex items-center gap-2 text-xs font-bold text-gray-700">
                    <FiCheckCircle className="text-secondary shrink-0" size={14} />
                    {txt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════ COLONNE DROITE — Formulaire ════ */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 sm:p-10 overflow-y-auto relative">
        <Link to="/" className="absolute top-6 right-8 text-sm font-bold text-gray-400 hover:text-primary transition-colors hidden lg:block">
          Retour à l'accueil
        </Link>

        <div className="max-w-lg w-full py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900">Créez votre compte 🚀</h2>
            <p className="mt-2 text-gray-500 font-medium">Rejoignez ConakryMarket et commencez à acheter ou vendre en Guinée.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Sélection du rôle */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">Je m'inscris en tant que :</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange('client')}
                  className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all font-bold text-sm ${
                    formData.role === 'client'
                      ? 'border-primary bg-primary/5 text-primary shadow-sm'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.role === 'client' ? 'bg-primary text-white' : 'bg-gray-100'}`}>
                    <FiShoppingCart size={16} />
                  </div>
                  <div className="text-left">
                    <p className="font-black">Client</p>
                    <p className="text-[10px] opacity-70 font-medium">Acheter des produits</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('vendeur')}
                  className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all font-bold text-sm ${
                    formData.role === 'vendeur'
                      ? 'border-secondary bg-secondary/5 text-secondary shadow-sm'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.role === 'vendeur' ? 'bg-secondary text-white' : 'bg-gray-100'}`}>
                    <FiBriefcase size={16} />
                  </div>
                  <div className="text-left">
                    <p className="font-black">Vendeur</p>
                    <p className="text-[10px] opacity-70 font-medium">Vendre mes produits</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Champs en grille */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Nom complet" icon={<FiUser size={16} className="text-gray-400" />}>
                <input
                  type="text" name="nom" required
                  value={formData.nom} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                  placeholder="Mamadou Diallo"
                />
              </FormField>

              <FormField label="Email" icon={<FiMail size={16} className="text-gray-400" />}>
                <input
                  type="email" name="email" required
                  value={formData.email} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                  placeholder="mamadou@email.com"
                />
              </FormField>

              <FormField label="Téléphone" icon={<FiPhone size={16} className="text-gray-400" />}>
                <input
                  type="tel" name="telephone" required
                  value={formData.telephone} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                  placeholder="+224 620 00 00 00"
                />
              </FormField>

              <FormField label="Mot de passe" icon={<FiLock size={16} className="text-gray-400" />}>
                <input
                  type="password" name="mot_de_passe" required minLength={6}
                  value={formData.mot_de_passe} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                  placeholder="Min. 6 caractères"
                />
              </FormField>

              <FormField label="Ville" icon={<FiMapPin size={16} className="text-gray-400" />}>
                <select
                  name="ville" required
                  value={formData.ville} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none text-sm font-medium"
                >
                  {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </FormField>

              <FormField label="Âge" icon={<FiCalendar size={16} className="text-gray-400" />}>
                <input
                  type="number" name="age" required min={18} max={99}
                  value={formData.age} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                  placeholder="25"
                />
              </FormField>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl shadow-lg text-base font-black text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 ${
                formData.role === 'vendeur'
                  ? 'bg-secondary hover:bg-green-700 shadow-secondary/30'
                  : 'bg-primary hover:bg-primary-dark shadow-primary/30'
              }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Créer mon compte <FiArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-600">
              Déjà inscrit ?{' '}
              <Link to="/connexion" className="font-black text-primary hover:text-primary-dark transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Composant utilitaire pour les champs */
const FormField = ({ label, icon, children }) => (
  <div>
    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      {children}
    </div>
  </div>
);

export default Register;
