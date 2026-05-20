import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduit, uploadImages } from '../services/produits';
import toast from 'react-hot-toast';
import { FiSave, FiImage, FiArrowLeft } from 'react-icons/fi';

const CATEGORIES = ['Électronique', 'Vêtements', 'Alimentation', 'Équipement agricole'];

const NewProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    stock: '',
    categorie: 'Électronique',
    ville_vendeur: 'Conakry',
    attributs: {}
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAttrChange = (e) => {
    setFormData({
      ...formData,
      attributs: { ...formData.attributs, [e.target.name]: e.target.value }
    });
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSubmit = {
        ...formData,
        prix: Number(formData.prix),
        stock: Number(formData.stock),
      };

      // Create product
      const product = await createProduit(dataToSubmit);

      // Upload images if any
      if (files.length > 0) {
        const formDataFiles = new FormData();
        files.forEach(file => {
          formDataFiles.append('images', file);
        });
        await uploadImages(product._id, formDataFiles);
      }

      toast.success('Produit créé avec succès !');
      navigate('/vendeur/produits');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  // Render specific attribute fields based on selected category
  const renderDynamicAttributes = () => {
    switch (formData.categorie) {
      case 'Électronique':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mt-4">
            <h3 className="col-span-full font-bold text-blue-800 mb-2">Caractéristiques Électroniques</h3>
            <div><label className="block text-sm mb-1 text-gray-700">Marque</label><input type="text" name="marque" onChange={handleAttrChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2" /></div>
            <div><label className="block text-sm mb-1 text-gray-700">Modèle</label><input type="text" name="modele" onChange={handleAttrChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2" /></div>
            <div><label className="block text-sm mb-1 text-gray-700">Processeur</label><input type="text" name="processeur" onChange={handleAttrChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2" /></div>
            <div><label className="block text-sm mb-1 text-gray-700">RAM (Go)</label><input type="number" name="ram_go" onChange={handleAttrChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2" /></div>
            <div><label className="block text-sm mb-1 text-gray-700">Stockage (Go)</label><input type="number" name="stockage_go" onChange={handleAttrChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2" /></div>
          </div>
        );
      case 'Vêtements':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-pink-50/50 p-6 rounded-2xl border border-pink-100 mt-4">
            <h3 className="col-span-full font-bold text-pink-800 mb-2">Détails Vêtement</h3>
            <div><label className="block text-sm mb-1 text-gray-700">Tailles (ex: S,M,L - séparées par virgule)</label><input type="text" onChange={(e) => setFormData({...formData, attributs: {...formData.attributs, taille: e.target.value.split(',')}})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2" /></div>
            <div><label className="block text-sm mb-1 text-gray-700">Couleurs (séparées par virgule)</label><input type="text" onChange={(e) => setFormData({...formData, attributs: {...formData.attributs, couleurs: e.target.value.split(',')}})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2" /></div>
            <div><label className="block text-sm mb-1 text-gray-700">Matière</label><input type="text" name="matiere" onChange={handleAttrChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2" /></div>
          </div>
        );
      case 'Alimentation':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-orange-50/50 p-6 rounded-2xl border border-orange-100 mt-4">
            <h3 className="col-span-full font-bold text-orange-800 mb-2">Informations Alimentaires</h3>
            <div><label className="block text-sm mb-1 text-gray-700">Poids (kg)</label><input type="number" step="0.01" name="poids_kg" onChange={handleAttrChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2" /></div>
            <div><label className="block text-sm mb-1 text-gray-700">Unité (ex: carton, sac)</label><input type="text" name="unite" onChange={handleAttrChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2" /></div>
            <div><label className="block text-sm mb-1 text-gray-700">Date de péremption</label><input type="date" name="peremption" onChange={handleAttrChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2" /></div>
          </div>
        );
      case 'Équipement agricole':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-50/50 p-6 rounded-2xl border border-green-100 mt-4">
            <h3 className="col-span-full font-bold text-green-800 mb-2">Spécifications Agricoles</h3>
            <div><label className="block text-sm mb-1 text-gray-700">Puissance (W)</label><input type="number" name="puissance_w" onChange={handleAttrChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2" /></div>
            <div><label className="block text-sm mb-1 text-gray-700">Garantie (mois)</label><input type="number" name="garantie_mois" onChange={handleAttrChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2" /></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 font-medium">
        <FiArrowLeft /> Retour
      </button>
      
      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">
        <h1 className="text-3xl font-black text-accent-dark mb-8">Ajouter un produit</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <label className="block text-sm font-bold text-gray-700 mb-2">Nom du produit</label>
              <input 
                type="text" name="nom" required value={formData.nom} onChange={handleChange} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Ex: iPhone 13 Pro Max"
              />
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea 
                name="description" required rows={4} value={formData.description} onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                placeholder="Décrivez votre produit en détail..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Prix (GNF)</label>
              <input 
                type="number" name="prix" required min="0" value={formData.prix} onChange={handleChange} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="100000"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Stock disponible</label>
              <input 
                type="number" name="stock" required min="0" value={formData.stock} onChange={handleChange} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="10"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Catégorie</label>
              <select 
                name="categorie" value={formData.categorie} onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ville d'expédition</label>
              <input 
                type="text" name="ville_vendeur" required value={formData.ville_vendeur} onChange={handleChange} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Dynamic Attributes */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-accent-dark border-b border-gray-100 pb-2">Attributs Spécifiques</h2>
            {renderDynamicAttributes()}
          </div>

          {/* Images */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-accent-dark border-b border-gray-100 pb-2 mb-4">Images du produit</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors">
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <FiImage size={48} className="text-gray-400 mb-4" />
                <span className="bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-bold text-gray-700 hover:text-primary hover:border-primary transition-all">
                  Parcourir les fichiers
                </span>
                <span className="text-xs text-gray-500 mt-2">{files.length} fichier(s) sélectionné(s)</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full mt-10 bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg shadow-primary/30 disabled:opacity-70"
          >
            {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><FiSave /> Enregistrer le produit</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewProduct;
