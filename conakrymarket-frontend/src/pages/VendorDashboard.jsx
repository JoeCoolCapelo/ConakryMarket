import React, { useEffect, useState } from 'react';
import { 
  getCACategories, 
  getTopProduits, 
  getCAVilles, 
  getEvolutionMensuelle, 
  getStockCritique 
} from '../services/dashboard';
import { updateProduit } from '../services/produits';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, PointElement, LineElement
} from 'chart.js';
import { FiDollarSign, FiShoppingBag, FiAlertTriangle, FiTrendingUp, FiSave } from 'react-icons/fi';
import { formatPrice } from '../utils/formatPrice';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, PointElement, LineElement
);

const VendorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [caCategories, setCaCategories] = useState([]);
  const [topProduits, setTopProduits] = useState([]);
  const [caVilles, setCaVilles] = useState([]);
  const [evolution, setEvolution] = useState([]);
  const [stockCritique, setStockCritique] = useState([]);
  const [updatingStockId, setUpdatingStockId] = useState(null);
  const [newStockValues, setNewStockValues] = useState({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [caCat, topP, caVil, evo, stock] = await Promise.all([
          getCACategories(),
          getTopProduits(),
          getCAVilles(),
          getEvolutionMensuelle(),
          getStockCritique()
        ]);
        setCaCategories(caCat);
        setTopProduits(topP);
        setCaVilles(caVil);
        setEvolution(evo);
        setStockCritique(stock);
      } catch (error) {
        console.error("Dashboard error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  const handleUpdateStock = async (product) => {
    const newStock = newStockValues[product._id] ?? product.stock;
    if (newStock === product.stock) return;

    // Empêcher de réduire le stock en dessous de la valeur actuelle
    if (newStock < product.stock) {
      toast.error(`Le stock ne peut pas être inférieur à la valeur actuelle (${product.stock}).`);
      setNewStockValues(prev => ({ ...prev, [product._id]: product.stock }));
      return;
    }

    setUpdatingStockId(product._id);
    try {
      const idToUpdate = product.pid || product._id;
      await updateProduit(idToUpdate, { stock: newStock });
      toast.success('Stock mis à jour avec succès');
      
      // Remove from list if no longer critical (e.g. > 10)
      if (newStock > 10) {
        setStockCritique(prev => prev.filter(p => p._id !== product._id));
      } else {
        setStockCritique(prev => prev.map(p => p._id === product._id ? { ...p, stock: newStock } : p));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingStockId(null);
    }
  };

  const handleStockChange = (id, value, currentStock) => {
    const parsed = parseInt(value) || 0;
    // Forcer la valeur minimale au stock actuel
    setNewStockValues(prev => ({ ...prev, [id]: Math.max(parsed, currentStock) }));
  };

  // KPIs
  const totalCA = evolution.reduce((sum, item) => sum + (item.ca_mensuel || 0), 0);
  const totalCommandes = evolution.reduce((sum, item) => sum + (item.nb_commandes || 0), 0);

  // Charts Config
  const barCaCatData = {
    labels: caCategories.map(c => c._id),
    datasets: [{
      label: 'Chiffre d\'Affaires (GNF)',
      data: caCategories.map(c => c.ca_total),
      backgroundColor: '#EA580C',
      borderRadius: 6,
    }]
  };

  const barTopProduitsData = {
    labels: topProduits.map(p => p._id || 'Inconnu'),
    datasets: [{
      label: 'Chiffre d\'Affaires (GNF)',
      data: topProduits.map(p => p.ca_produit),
      backgroundColor: '#047857',
      borderRadius: 6,
    }]
  };

  const doughnutCaVillesData = {
    labels: caVilles.map(v => v._id),
    datasets: [{
      data: caVilles.map(v => v.ca_ville),
      backgroundColor: ['#EA580C', '#047857', '#FBBF24', '#3B82F6', '#8B5CF6'],
      borderWidth: 0,
    }]
  };

  const lineEvoData = {
    labels: evolution.map(e => `${e._id.mois}/${e._id.annee}`),
    datasets: [{
      label: 'CA Mensuel (GNF)',
      data: evolution.map(e => e.ca_mensuel),
      borderColor: '#EA580C',
      backgroundColor: 'rgba(234, 88, 12, 0.1)',
      tension: 0.4,
      fill: true,
    }]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-black text-accent-dark mb-8"
      >
        Tableau de Bord
      </motion.h1>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
              <FiDollarSign size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">CA Total</p>
              <p className="text-2xl font-black text-accent-dark">{formatPrice(totalCA)}</p>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <FiShoppingBag size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Commandes</p>
              <p className="text-2xl font-black text-accent-dark">{totalCommandes}</p>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
              <FiTrendingUp size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Moy. Panier</p>
              <p className="text-2xl font-black text-accent-dark">{totalCommandes > 0 ? formatPrice(totalCA/totalCommandes) : '0 GNF'}</p>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
              <FiAlertTriangle size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Stock Critique</p>
              <p className="text-2xl font-black text-red-600">{stockCritique.length} produits</p>
            </div>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-accent-dark mb-6">Évolution Mensuelle</h3>
            <div className="h-72">
              <Line data={lineEvoData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-accent-dark mb-6">CA par Catégorie</h3>
            <div className="h-72">
              <Bar data={barCaCatData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-accent-dark mb-6">Mes Meilleures Ventes</h3>
            <div className="h-72">
              <Bar data={barTopProduitsData} options={{ maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } } }} />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-lg font-bold text-accent-dark mb-6">Répartition par Ville</h3>
            <div className="h-72 flex-1 flex items-center justify-center">
              <div className="w-full max-w-[300px]">
                <Doughnut data={doughnutCaVillesData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Stock Critique Table */}
        {stockCritique.length > 0 && (
          <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-red-50/50">
            <h3 className="text-lg font-bold text-red-800 flex items-center gap-2">
              <FiAlertTriangle /> Alertes Stock Critique
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-semibold">Produit</th>
                  <th className="p-4 font-semibold">Catégorie</th>
                  <th className="p-4 font-semibold">Stock Actuel</th>
                  <th className="p-4 font-semibold w-48 text-right">Mettre à jour</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stockCritique.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{p.nom}</td>
                    <td className="p-4 text-gray-500">{p.categorie}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-bold text-sm">
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <input 
                          type="number"
                          min={p.stock}
                          value={newStockValues[p._id] !== undefined ? newStockValues[p._id] : p.stock}
                          onChange={(e) => handleStockChange(p._id, e.target.value, p.stock)}
                          className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-center text-sm focus:outline-none focus:border-primary"
                        />
                        <button 
                          onClick={() => handleUpdateStock(p)}
                          disabled={updatingStockId === p._id || (newStockValues[p._id] === undefined ? false : newStockValues[p._id] === p.stock)}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                          title="Enregistrer"
                        >
                          {updatingStockId === p._id ? (
                            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                          ) : (
                            <FiSave size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
      </motion.div>
    </div>
  );
};

export default VendorDashboard;
