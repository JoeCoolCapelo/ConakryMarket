import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiLock, FiAward, FiShoppingBag, FiDollarSign, FiCamera } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user, isVendeur, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    telephone: user?.telephone || '',
    ville: user?.ville || '',
    age: user?.age || '',
    mot_de_passe: ''
  });
  
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.photo_profil || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('telephone', formData.telephone);
      formDataToSend.append('ville', formData.ville);
      
      if (formData.age) formDataToSend.append('age', parseInt(formData.age, 10));
      if (formData.mot_de_passe) formDataToSend.append('mot_de_passe', formData.mot_de_passe);
      if (photoFile) formDataToSend.append('photo_profil', photoFile);

      await updateProfile(formDataToSend);
      setFormData(prev => ({ ...prev, mot_de_passe: '' }));
      setPhotoFile(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="min-h-[85vh] bg-[#FDFDFD] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Mon Profil</h1>
          <p className="text-lg text-gray-500">Gérez vos informations personnelles et vos préférences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card & Stats */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary to-orange-400 opacity-10"></div>
              
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-primary to-orange-500 p-1 mb-5 shadow-xl group">
                <label htmlFor="photo-upload" className="cursor-pointer w-full h-full block">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profil" className="w-full h-full object-cover" />
                    ) : (
                      <FiUser className="text-5xl text-primary" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiCamera className="text-white text-2xl" />
                    </div>
                  </div>
                </label>
                <input 
                  type="file" 
                  id="photo-upload" 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handlePhotoChange}
                />
              </div>
              
              <h2 className="text-2xl font-black text-gray-900 mb-1">{user?.nom}</h2>
              <p className="text-gray-500 mb-5 flex items-center justify-center gap-2 font-medium text-sm">
                <FiMail className="text-gray-400" /> {user?.email}
              </p>
              
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-sm font-bold text-primary">
                <FiAward className="mr-2" size={18} />
                {isVendeur ? 'Vendeur Certifié' : 'Client Fidèle'}
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-5">
                Statistiques
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100/50">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm text-blue-500">
                      <FiCalendar size={18} />
                    </div>
                    <span className="font-semibold text-sm">Membre depuis</span>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">{formatDate(user?.date_inscription)}</span>
                </div>
                
                <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100/50">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm text-green-500">
                      <FiShoppingBag size={18} />
                    </div>
                    <span className="font-semibold text-sm">Commandes</span>
                  </div>
                  <span className="font-bold text-gray-900">{user?.nb_commandes_total || 0}</span>
                </div>

                {isVendeur && (
                  <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100/50">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="p-2.5 bg-white rounded-xl shadow-sm text-yellow-500">
                        <FiDollarSign size={18} />
                      </div>
                      <span className="font-semibold text-sm">Chiffre d'affaires</span>
                    </div>
                    <span className="font-bold text-gray-900">{(user?.ca_total || 0).toLocaleString()} GNF</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Edit Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30">
                <h2 className="text-xl font-bold text-gray-900">Modifier mes informations</h2>
              </div>
              
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nom */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <FiUser className="text-gray-400" /> Nom complet
                      </label>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-gray-50 focus:bg-white text-gray-900 font-medium"
                        placeholder="Votre nom"
                      />
                    </div>

                    {/* Age */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <FiCalendar className="text-gray-400" /> Âge
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-gray-50 focus:bg-white text-gray-900 font-medium"
                        placeholder="Ex: 25"
                      />
                    </div>

                    {/* Telephone */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <FiPhone className="text-gray-400" /> Téléphone
                      </label>
                      <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-gray-50 focus:bg-white text-gray-900 font-medium"
                        placeholder="+224 620 00 00 00"
                      />
                    </div>

                    {/* Ville */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <FiMapPin className="text-gray-400" /> Ville
                      </label>
                      <div className="relative">
                        <select
                          name="ville"
                          value={formData.ville}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-gray-50 focus:bg-white appearance-none text-gray-900 font-medium"
                        >
                          <option value="">Sélectionner une ville</option>
                          <option value="Conakry">Conakry</option>
                          <option value="Kindia">Kindia</option>
                          <option value="Kankan">Kankan</option>
                          <option value="Labé">Labé</option>
                          <option value="Mamou">Mamou</option>
                          <option value="Nzérékoré">Nzérékoré</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-8 mt-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                      <FiLock className="text-primary" /> Sécurité
                    </h3>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Nouveau mot de passe</label>
                      <input
                        type="password"
                        name="mot_de_passe"
                        value={formData.mot_de_passe}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-gray-50 focus:bg-white text-gray-900 font-medium"
                        placeholder="Laisser vide pour conserver l'actuel"
                      />
                      <p className="text-xs text-gray-500 mt-2 font-medium">Ne remplissez ce champ que si vous souhaitez changer votre mot de passe.</p>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-8 py-3.5 rounded-xl font-bold text-white transition-all flex items-center gap-2 ${
                        isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-primary to-orange-500 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40'
                      }`}
                    >
                      {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
