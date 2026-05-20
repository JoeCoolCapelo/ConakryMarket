import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getGlobalStats,
  getAdminCACategories,
  getAdminTopProduits,
  getAdminCAVilles,
  getAdminEvolutionMensuelle,
  getAdminStockCritique,
  getAdminTopVendeurs,
} from '../../services/admin';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import {
  FiUsers, FiBox, FiShoppingBag, FiDollarSign,
  FiTrendingUp, FiAlertTriangle, FiUserCheck, FiShoppingCart,
  FiCheckCircle, FiClock, FiXCircle, FiArrowRight
} from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  ArcElement, Title, Tooltip, Legend, Filler
);

const MOIS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [caCategories, setCaCategories] = useState([]);
  const [topProduits, setTopProduits] = useState([]);
  const [caVilles, setCaVilles] = useState([]);
  const [evolution, setEvolution] = useState([]);
  const [stockCritique, setStockCritique] = useState([]);
  const [topVendeurs, setTopVendeurs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, cat, top, villes, evo, stock, vendeurs] = await Promise.all([
          getGlobalStats(),
          getAdminCACategories(),
          getAdminTopProduits(),
          getAdminCAVilles(),
          getAdminEvolutionMensuelle(),
          getAdminStockCritique(),
          getAdminTopVendeurs(),
        ]);
        setStats(s);
        setCaCategories(cat);
        setTopProduits(top);
        setCaVilles(villes);
        setEvolution(evo);
        setStockCritique(stock);
        setTopVendeurs(vendeurs);
      } catch (err) {
        console.error('Erreur chargement dashboard admin', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Chargement du Back-Office...</p>
      </div>
    </div>
  );

  // --- Chart Data ---
  const categorieColors = ['#8B5CF6', '#F97316', '#059669', '#EF4444'];
  const categorieChartData = {
    labels: caCategories.map(c => c._id || 'Autre'),
    datasets: [{
      data: caCategories.map(c => c.ca_total),
      backgroundColor: categorieColors,
      borderWidth: 0,
      hoverOffset: 8,
    }],
  };

  const evolutionChartData = {
    labels: evolution.map(e => `${MOIS[e._id.mois - 1]} ${e._id.annee}`),
    datasets: [
      {
        label: 'Chiffre d\'affaires',
        data: evolution.map(e => e.ca_mensuel),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#8B5CF6',
      },
      {
        label: 'Nb commandes',
        data: evolution.map(e => e.nb_commandes),
        borderColor: '#F97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#F97316',
        yAxisID: 'y1',
      }
    ],
  };

  const villesChartData = {
    labels: caVilles.map(v => v._id || 'Inconnue'),
    datasets: [{
      label: 'CA par ville',
      data: caVilles.map(v => v.ca_ville),
      backgroundColor: 'rgba(139, 92, 246, 0.7)',
      borderColor: '#8B5CF6',
      borderWidth: 1,
      borderRadius: 8,
    }],
  };

  const topProduitsChartData = {
    labels: topProduits.map(p => p._id?.length > 20 ? p._id.slice(0, 20) + '…' : p._id),
    datasets: [{
      label: 'CA Produit',
      data: topProduits.map(p => p.ca_produit),
      backgroundColor: 'rgba(249, 115, 22, 0.7)',
      borderColor: '#F97316',
      borderWidth: 1,
      borderRadius: 8,
    }],
  };

  const commandesPieData = {
    labels: ['Livrées', 'En attente', 'Annulées'],
    datasets: [{
      data: [stats?.commandesLivrees || 0, stats?.commandesEnAttente || 0, stats?.commandesAnnulees || 0],
      backgroundColor: ['#059669', '#F59E0B', '#EF4444'],
      borderWidth: 0,
      hoverOffset: 8,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1C1917',
        titleFont: { weight: 'bold' },
        padding: 12,
        cornerRadius: 12,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label || ''}: ${formatPrice(ctx.raw)}`,
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11, weight: 'bold' } } },
      y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 }, callback: v => formatPrice(v) } },
    },
  };

  const evolutionOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: { display: true, position: 'top', labels: { font: { weight: 'bold', size: 11 }, usePointStyle: true, pointStyle: 'circle' } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10, weight: 'bold' } } },
      y: { position: 'left', grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 }, callback: v => formatPrice(v) } },
      y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { font: { size: 11 } } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { font: { weight: 'bold', size: 12 }, padding: 16, usePointStyle: true, pointStyle: 'circle' } },
      tooltip: { backgroundColor: '#1C1917', padding: 12, cornerRadius: 12 }
    },
    cutout: '65%',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900">Tableau de Bord Administrateur</h1>
        <p className="text-gray-500 mt-1">Vue globale de l'activité sur ConakryMarket</p>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard icon={<FiDollarSign size={24}/>} label="CA Global" value={formatPrice(stats?.caGlobal || 0)} color="purple" />
        <KPICard icon={<FiShoppingBag size={24}/>} label="Commandes" value={stats?.totalCommandes || 0} color="orange" />
        <KPICard icon={<FiBox size={24}/>} label="Produits Actifs" value={stats?.totalProduits || 0} color="green" />
        <KPICard icon={<FiUsers size={24}/>} label="Utilisateurs" value={stats?.totalUsers || 0} color="blue" />
      </div>

      {/* KPI Cards Row 2 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <MiniKPI icon={<FiUserCheck size={18}/>} label="Clients" value={stats?.totalClients || 0} color="blue" />
        <MiniKPI icon={<FiShoppingCart size={18}/>} label="Vendeurs" value={stats?.totalVendeurs || 0} color="orange" />
        <MiniKPI icon={<FiCheckCircle size={18}/>} label="Livrées" value={stats?.commandesLivrees || 0} color="green" />
        <MiniKPI icon={<FiClock size={18}/>} label="En attente" value={stats?.commandesEnAttente || 0} color="yellow" />
        <MiniKPI icon={<FiAlertTriangle size={18}/>} label="Stock critique" value={stats?.stockCritique || 0} color="red" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Évolution Mensuelle */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-black text-gray-900">Évolution Mensuelle</h2>
              <p className="text-xs text-gray-500 mt-0.5">Chiffre d'affaires et volume de commandes</p>
            </div>
            <FiTrendingUp className="text-purple-500" size={20} />
          </div>
          <div className="h-72">
            {evolution.length > 0 ? <Line data={evolutionChartData} options={evolutionOptions} /> : <EmptyChart />}
          </div>
        </div>

        {/* CA par Catégorie */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-black text-gray-900 mb-1">CA par Catégorie</h2>
          <p className="text-xs text-gray-500 mb-6">Répartition du chiffre d'affaires</p>
          <div className="h-64">
            {caCategories.length > 0 ? <Doughnut data={categorieChartData} options={doughnutOptions} /> : <EmptyChart />}
          </div>
          {caCategories.length > 0 && (
            <div className="mt-4 space-y-2">
              {caCategories.map((c, i) => (
                <div key={c._id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: categorieColors[i % categorieColors.length] }}></span>
                    <span className="font-medium text-gray-700">{c._id}</span>
                  </div>
                  <span className="font-bold text-gray-900">{formatPrice(c.ca_total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Répartition des Commandes */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-black text-gray-900 mb-1">Statut des Commandes</h2>
          <p className="text-xs text-gray-500 mb-6">Répartition par statut</p>
          <div className="h-64">
            <Doughnut data={commandesPieData} options={doughnutOptions} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-xl font-black text-green-600">{stats?.commandesLivrees || 0}</p>
              <p className="text-xs text-green-700 font-medium">Livrées</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3">
              <p className="text-xl font-black text-yellow-600">{stats?.commandesEnAttente || 0}</p>
              <p className="text-xs text-yellow-700 font-medium">En attente</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3">
              <p className="text-xl font-black text-red-600">{stats?.commandesAnnulees || 0}</p>
              <p className="text-xs text-red-700 font-medium">Annulées</p>
            </div>
          </div>
        </div>

        {/* CA par Ville */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-black text-gray-900 mb-1">CA par Ville</h2>
          <p className="text-xs text-gray-500 mb-6">Performance géographique</p>
          <div className="h-64">
            {caVilles.length > 0 ? <Bar data={villesChartData} options={chartOptions} /> : <EmptyChart />}
          </div>
        </div>

        {/* Top Produits */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-black text-gray-900 mb-1">Top 10 Produits</h2>
          <p className="text-xs text-gray-500 mb-6">Produits les plus vendus sur la plateforme</p>
          <div className="h-64">
            {topProduits.length > 0 ? <Bar data={topProduitsChartData} options={{...chartOptions, indexAxis: 'y'}} /> : <EmptyChart />}
          </div>
        </div>
      </div>

      {/* Bottom Info Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vendeurs */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-black text-gray-900">Meilleurs Vendeurs</h2>
              <p className="text-xs text-gray-500 mt-0.5">Classement par chiffre d'affaires</p>
            </div>
            <Link to="/admin/utilisateurs" className="text-purple-600 hover:text-purple-700 text-sm font-bold flex items-center gap-1">
              Voir tout <FiArrowRight size={14}/>
            </Link>
          </div>
          <div className="space-y-3">
            {topVendeurs.length === 0 && <p className="text-center text-gray-400 py-8">Aucune donnée disponible</p>}
            {topVendeurs.map((v, i) => (
              <div key={v._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                  i === 0 ? 'bg-yellow-100 text-yellow-700' :
                  i === 1 ? 'bg-gray-100 text-gray-600' :
                  i === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-50 text-gray-500'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{v.nom || v._id}</p>
                  <p className="text-xs text-gray-500 truncate">{v.email || v._id}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-purple-600 text-sm">{formatPrice(v.ca_vendeur)}</p>
                  <p className="text-xs text-gray-400">{v.nb_ventes} ventes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Critique */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-black text-gray-900">Produits en Stock Critique</h2>
              <p className="text-xs text-gray-500 mt-0.5">Produits avec moins de 10 unités</p>
            </div>
            <Link to="/admin/produits" className="text-purple-600 hover:text-purple-700 text-sm font-bold flex items-center gap-1">
              Voir tout <FiArrowRight size={14}/>
            </Link>
          </div>
          <div className="space-y-3">
            {stockCritique.length === 0 && <p className="text-center text-gray-400 py-8">Aucun produit en rupture</p>}
            {stockCritique.map(p => (
              <div key={p._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.nom} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><FiBox className="text-gray-300" size={18}/></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{p.nom}</p>
                  <p className="text-xs text-gray-500">{p.categorie}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                    p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {p.stock === 0 ? 'Rupture !' : `${p.stock} restants`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dernières Inscriptions */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-black text-gray-900">Dernières Inscriptions</h2>
              <p className="text-xs text-gray-500 mt-0.5">Les 5 derniers utilisateurs inscrits</p>
            </div>
            <Link to="/admin/utilisateurs" className="text-purple-600 hover:text-purple-700 text-sm font-bold flex items-center gap-1">
              Gérer <FiArrowRight size={14}/>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {(stats?.dernierInscrit || []).map(u => (
              <div key={u._id} className="bg-gray-50 rounded-2xl p-4 text-center hover:shadow-sm transition-all">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-black text-lg ${
                  u.role === 'vendeur' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {u.nom?.charAt(0).toUpperCase()}
                </div>
                <p className="font-bold text-gray-900 text-sm truncate">{u.nom}</p>
                <p className="text-xs text-gray-500 truncate">{u.email}</p>
                <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-black ${
                  u.role === 'vendeur' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const KPICard = ({ icon, label, value, color }) => {
  const colors = {
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
  };
  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
};

const MiniKPI = ({ icon, label, value, color }) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    orange: 'text-orange-600 bg-orange-50 border-orange-100',
    green: 'text-green-600 bg-green-50 border-green-100',
    yellow: 'text-yellow-600 bg-yellow-50 border-yellow-100',
    red: 'text-red-600 bg-red-50 border-red-100',
  };
  return (
    <div className={`flex items-center gap-3 p-3 rounded-2xl border ${colors[color]}`}>
      {icon}
      <div>
        <p className="text-lg font-black">{value}</p>
        <p className="text-[10px] uppercase tracking-wider font-bold opacity-70">{label}</p>
      </div>
    </div>
  );
};

const EmptyChart = () => (
  <div className="h-full flex items-center justify-center text-gray-300">
    <p className="text-sm font-medium">Aucune donnée disponible</p>
  </div>
);

export default AdminDashboard;
