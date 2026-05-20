import React, { useEffect, useState } from 'react';
import { FiTrash2, FiSearch, FiPackage, FiStar, FiX, FiUser } from 'react-icons/fi';
import { getProduits, deleteProduit } from '../../services/produits';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const AdminProducts = () => {
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

  const fetchAllProducts = async () => {
    try {
      const data = await getProduits({ limit: 500 });
      setProducts(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Action irréversible. Voulez-vous vraiment supprimer ce produit de la plateforme ?")) {
      try {
        await deleteProduit(id);
        toast.success("Produit supprimé");
        setProducts(products.filter(p => p._id !== id && p.pid !== id));
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-accent-dark">Modération des Produits</h1>
        <p className="text-gray-500 mt-1">Supervisez l'intégralité du catalogue ({filteredProducts.length} produits)</p>
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
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-600/30 hover:text-purple-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-20 text-center">
          <FiPackage size={64} className="mx-auto text-gray-200 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">Catalogue vide</h3>
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
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center gap-1.5 text-xs text-purple-600 font-bold mb-2 bg-purple-50 w-max px-2 py-1 rounded-md">
                  <FiUser size={12} />
                  Vendeur ID: {product.vendeur_uid.slice(0, 8)}
                </div>
                <h3 className="font-bold text-gray-800 text-sm line-clamp-1 mb-1">{product.nom}</h3>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-lg font-black text-gray-900">{formatPrice(product.prix)}</p>
                  <p className="text-xs text-gray-500 font-bold">{product.stock} en stock</p>
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 border-t border-gray-50 pt-4">
                <button 
                  onClick={() => handleDelete(product.pid || product._id)}
                  className="w-full flex items-center justify-center gap-2 p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white font-bold transition-colors"
                >
                  <FiTrash2 size={16} /> Supprimer de la plateforme
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
