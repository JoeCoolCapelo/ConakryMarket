import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage, FiStar, FiX } from 'react-icons/fi';
import { getProduits, deleteProduit } from '../services/produits';
import { useAuth } from '../hooks/useAuth';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';

const VendorProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tous');

  const categories = ['Tous', 'Électronique', 'Vêtements', 'Alimentation', 'Équipement agricole'];

  const filteredProducts = products.filter(p => {
    const matchSearch = p.nom?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'Tous' || p.categorie === categoryFilter;
    return matchSearch && matchCategory;
  });

  const fetchMyProducts = async () => {
    try {
      const data = await getProduits({ vendeur: user._id, limit: 100 });
      setProducts(data.data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement de vos produits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, [user._id]);

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      try {
        await deleteProduit(id);
        toast.success("Produit supprimé");
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-accent-dark">Mes Produits</h1>
          <p className="text-gray-500 mt-1">Gérez votre catalogue ({filteredProducts.length} / {products.length})</p>
        </div>
        <Link 
          to="/vendeur/produits/nouveau" 
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/30 hover:-translate-y-0.5"
        >
          <FiPlus /> Ajouter un produit
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom..." 
            className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <FiX size={18} />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === cat
                  ? 'bg-primary text-white shadow-md shadow-primary/30'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary/30 hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-20 text-center">
          <FiPackage size={64} className="mx-auto text-gray-200 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">Aucun produit</h3>
          <p className="text-gray-500 mb-6">Vous n'avez pas encore ajouté de produit à votre catalogue.</p>
          <Link 
            to="/vendeur/produits/nouveau" 
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-xl font-bold hover:bg-primary hover:text-white transition-colors"
          >
            <FiPlus /> Créer mon premier produit
          </Link>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
          <FiSearch size={48} className="mx-auto text-gray-200 mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">Aucun résultat</h3>
          <p className="text-gray-500">Aucun produit ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map(product => (
            <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              {/* Image */}
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                {product.images?.[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.nom} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <FiPackage size={40} className="text-gray-300" />
                  </div>
                )}
                {/* Category Badge */}
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg text-xs font-bold shadow-sm">
                  {product.categorie}
                </span>
                {/* Stock Badge */}
                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm ${
                  product.stock > 10 ? 'bg-green-500 text-white' :
                  product.stock > 0 ? 'bg-orange-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-sm line-clamp-1 mb-1">{product.nom}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                  <FiStar className="text-yellow-400 fill-yellow-400" size={12} />
                  <span>{product.note_moyenne?.toFixed(1) || '0.0'}</span>
                </div>
                <p className="text-lg font-black text-primary">{formatPrice(product.prix)}</p>
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex gap-2">
                <Link 
                  to={`/vendeur/produits/${product.pid || product._id}/edit`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors"
                >
                  <FiEdit2 size={14} /> Modifier
                </Link>
                <button 
                  onClick={() => handleDelete(product._id)}
                  className="flex items-center justify-center p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                  title="Supprimer"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorProducts;
