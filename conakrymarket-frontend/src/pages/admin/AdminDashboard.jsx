import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  getGlobalStats,
  getAdminCACategories,
  getAdminTopProduits,
  getAdminCAVilles,
  getAdminEvolutionMensuelle,
  getAdminStockCritique,
  getAdminTopVendeurs,
  getAllAbonnements,
} from '../../services/admin';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import {
  FiUsers, FiBox, FiShoppingBag, FiDollarSign,
  FiTrendingUp, FiAlertTriangle, FiUserCheck, FiShoppingCart,
  FiCheckCircle, FiClock, FiXCircle, FiArrowRight, FiCreditCard
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

// ─── Hook: compte animé (0 → valeur finale) ───────────────────────────────────
const useCountUp = (target, duration = 1400, started = false) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started || !target) return;
    const isPrice = typeof target === 'string' && target.includes(' ');
    const numericTarget = typeof target === 'number' ? target : parseFloat(String(target).replace(/[^\d.]/g, ''));
    if (isNaN(numericTarget) || numericTarget === 0) { setValue(target); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * numericTarget);
      setValue(current);
      if (progress < 1) requestAnimationFrame(step);
      else setValue(target);
    };
    requestAnimationFrame(step);
  }, [target, started, duration]);
  return value;
};

// ─── Hook: détecte quand un élément entre dans le viewport ────────────────────
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

// ─── Styles d'animation CSS injectés une seule fois ──────────────────────────
const AnimStyles = () => (
  <style>{`
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeSlideLeft {
      from { opacity: 0; transform: translateX(-20px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.92); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
    @keyframes pulseRing {
      0%   { box-shadow: 0 0 0 0 rgba(139,92,246,0.35); }
      70%  { box-shadow: 0 0 0 10px rgba(139,92,246,0); }
      100% { box-shadow: 0 0 0 0 rgba(139,92,246,0); }
    }
    @keyframes progressFill {
      from { width: 0%; }
    }

    .anim-fade-up   { animation: fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) both; }
    .anim-fade-left { animation: fadeSlideLeft 0.5s cubic-bezier(.22,1,.36,1) both; }
    .anim-scale-in  { animation: scaleIn 0.5s cubic-bezier(.22,1,.36,1) both; }

    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 800px 100%;
      animation: shimmer 1.4s infinite;
      border-radius: 12px;
    }

    .kpi-pulse { animation: pulseRing 2.2s infinite; }

    .progress-bar-anim {
      animation: progressFill 1.2s cubic-bezier(.22,1,.36,1) both;
    }

    .card-hover {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .card-hover:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important;
    }

    .chart-wrapper {
      opacity: 0;
      transition: opacity 0.6s ease;
    }
    .chart-wrapper.visible {
      opacity: 1;
    }
  `}</style>
);

// ─── Composant KPICard avec compteur animé ────────────────────────────────────
const KPICard = ({ icon, label, value, color, delay = 0 }) => {
  const [ref, inView] = useInView();
  const isNumeric = typeof value === 'number';
  const animValue = useCountUp(isNumeric ? value : 0, 1400, inView);

  const colors = {
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    green:  'bg-green-100 text-green-600',
    blue:   'bg-blue-100 text-blue-600',
  };

  return (
    <div
      ref={ref}
      className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 card-hover"
      style={{
        opacity: inView ? 1 : 0,
        animation: inView ? `fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) ${delay}ms both` : 'none',
      }}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center kpi-pulse ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-xl font-black text-gray-900">
          {isNumeric ? animValue.toLocaleString('fr-FR') : value}
        </p>
      </div>
    </div>
  );
};

// ─── MiniKPI avec compteur animé ──────────────────────────────────────────────
const MiniKPI = ({ icon, label, value, color, delay = 0 }) => {
  const [ref, inView] = useInView();
  const animValue = useCountUp(typeof value === 'number' ? value : 0, 1200, inView);

  const colors = {
    blue:   'text-blue-600 bg-blue-50 border-blue-100',
    orange: 'text-orange-600 bg-orange-50 border-orange-100',
    green:  'text-green-600 bg-green-50 border-green-100',
    yellow: 'text-yellow-600 bg-yellow-50 border-yellow-100',
    red:    'text-red-600 bg-red-50 border-red-100',
  };

  return (
    <div
      ref={ref}
      className={`flex items-center gap-3 p-3 rounded-2xl border card-hover ${colors[color]}`}
      style={{
        opacity: inView ? 1 : 0,
        animation: inView ? `fadeSlideUp 0.5s cubic-bezier(.22,1,.36,1) ${delay}ms both` : 'none',
      }}
    >
      {icon}
      <div>
        <p className="text-lg font-black">
          {typeof value === 'number' ? animValue.toLocaleString('fr-FR') : value}
        </p>
        <p className="text-[10px] uppercase tracking-wider font-bold opacity-70">{label}</p>
      </div>
    </div>
  );
};

// ─── Carte de graphique animée à l'entrée dans le viewport ───────────────────
const ChartCard = ({ title, subtitle, icon, children, colSpan = '', delay = 0 }) => {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`bg-white rounded-3xl shadow-sm border border-gray-100 p-6 card-hover ${colSpan}`}
      style={{
        opacity: inView ? 1 : 0,
        animation: inView ? `scaleIn 0.5s cubic-bezier(.22,1,.36,1) ${delay}ms both` : 'none',
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-black text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {icon}
      </div>
      <div className={`chart-wrapper ${inView ? 'visible' : ''}`} style={{ transitionDelay: `${delay + 200}ms` }}>
        {children}
      </div>
    </div>
  );
};

// ─── Ligne de vendeur/stock avec animation fadeLeft ──────────────────────────
const AnimatedRow = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView(0.05);
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        animation: inView ? `fadeSlideLeft 0.45s cubic-bezier(.22,1,.36,1) ${delay}ms both` : 'none',
      }}
    >
      {children}
    </div>
  );
};

// ─── Barre de stock avec remplissage progressif ───────────────────────────────
const StockBar = ({ stock, max = 10 }) => {
  const [ref, inView] = useInView();
  const pct = Math.min((stock / max) * 100, 100);
  const color = stock === 0 ? '#EF4444' : stock <= 3 ? '#F97316' : '#F59E0B';
  return (
    <div ref={ref} className="w-20 hidden sm:block">
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            backgroundColor: color,
            width: inView ? `${pct}%` : '0%',
            transition: 'width 1s cubic-bezier(.22,1,.36,1)',
          }}
        />
      </div>
    </div>
  );
};

const EmptyChart = () => (
  <div className="h-full flex items-center justify-center text-gray-300">
    <p className="text-sm font-medium">Aucune donnée disponible</p>
  </div>
);

// ─── Squelette de chargement ──────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
    <div className="mb-10">
      <div className="skeleton h-8 w-64 mb-2" />
      <div className="skeleton h-4 w-48" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-20 rounded-3xl" />)}
    </div>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="skeleton h-80 rounded-3xl lg:col-span-2" />
      <div className="skeleton h-72 rounded-3xl" />
      <div className="skeleton h-72 rounded-3xl" />
    </div>
  </div>
);

// ─── Composant principal ──────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [caCategories, setCaCategories] = useState([]);
  const [topProduits, setTopProduits] = useState([]);
  const [caVilles, setCaVilles] = useState([]);
  const [evolution, setEvolution] = useState([]);
  const [stockCritique, setStockCritique] = useState([]);
  const [topVendeurs, setTopVendeurs] = useState([]);
  const [abonnements, setAbonnements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, cat, top, villes, evo, stock, vendeurs, abos] = await Promise.all([
          getGlobalStats(),
          getAdminCACategories(),
          getAdminTopProduits(),
          getAdminCAVilles(),
          getAdminEvolutionMensuelle(),
          getAdminStockCritique(),
          getAdminTopVendeurs(),
          getAllAbonnements({ limit: 5 })
        ]);
        setStats(s);
        setCaCategories(cat);
        setTopProduits(top);
        setCaVilles(villes);
        setEvolution(evo);
        setStockCritique(stock);
        setTopVendeurs(vendeurs);
        setAbonnements(abos.slice(0, 5));
      } catch (err) {
        console.error('Erreur chargement dashboard admin', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <LoadingSkeleton />;

  // --- Chart Data (inchangé) ---
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
        label: "Chiffre d'affaires",
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
    animation: { duration: 1000, easing: 'easeOutQuart' },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1C1917',
        titleFont: { weight: 'bold' },
        padding: 12,
        cornerRadius: 12,
        callbacks: { label: (ctx) => `${ctx.dataset.label || ''}: ${formatPrice(ctx.raw)}` }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11, weight: 'bold' } } },
      y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 }, callback: v => formatPrice(v) } },
    },
  };

  const evolutionOptions = {
    ...chartOptions,
    animation: { duration: 1200, easing: 'easeOutQuart' },
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
    animation: { animateRotate: true, duration: 1000, easing: 'easeOutQuart' },
    plugins: {
      legend: { position: 'bottom', labels: { font: { weight: 'bold', size: 12 }, padding: 16, usePointStyle: true, pointStyle: 'circle' } },
      tooltip: { backgroundColor: '#1C1917', padding: 12, cornerRadius: 12 }
    },
    cutout: '65%',
  };

  // Compteur pour abonnements CA total (affiché dans le header)
  const caGlobal = stats?.caGlobal || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
      <AnimStyles />

      {/* Header animé */}
      <div className="mb-10 anim-fade-up" style={{ animationDuration: '0.6s' }}>
        <h1 className="text-3xl font-black text-gray-900">Tableau de Bord Administrateur</h1>
        <p className="text-gray-500 mt-1">Vue globale de l'activité sur ConakryMarket</p>
      </div>

      {/* KPI Cards Row 1 — chaque carte apparaît avec un décalage */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard icon={<FiDollarSign size={24}/>} label="CA Global"       value={formatPrice(caGlobal)} color="purple" delay={0}   />
        <KPICard icon={<FiShoppingBag size={24}/>} label="Commandes"      value={stats?.totalCommandes || 0} color="orange" delay={80}  />
        <KPICard icon={<FiBox size={24}/>}         label="Produits Actifs" value={stats?.totalProduits || 0}  color="green"  delay={160} />
        <KPICard icon={<FiUsers size={24}/>}       label="Utilisateurs"   value={stats?.totalUsers || 0}     color="blue"   delay={240} />
      </div>

      {/* KPI Cards Row 2 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <MiniKPI icon={<FiUserCheck size={18}/>}   label="Clients"        value={stats?.totalClients || 0}         color="blue"   delay={0}   />
        <MiniKPI icon={<FiShoppingCart size={18}/>} label="Vendeurs"       value={stats?.totalVendeurs || 0}        color="orange" delay={60}  />
        <MiniKPI icon={<FiCheckCircle size={18}/>} label="Livrées"        value={stats?.commandesLivrees || 0}     color="green"  delay={120} />
        <MiniKPI icon={<FiClock size={18}/>}       label="En attente"     value={stats?.commandesEnAttente || 0}   color="yellow" delay={180} />
        <MiniKPI icon={<FiAlertTriangle size={18}/>} label="Stock critique" value={stats?.stockCritique || 0}      color="red"    delay={240} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Évolution Mensuelle */}
        <ChartCard
          title="Évolution Mensuelle"
          subtitle="Chiffre d'affaires et volume de commandes"
          icon={<FiTrendingUp className="text-purple-500" size={20} />}
          colSpan="lg:col-span-2"
          delay={0}
        >
          <div className="h-72">
            {evolution.length > 0 ? <Line data={evolutionChartData} options={evolutionOptions} /> : <EmptyChart />}
          </div>
        </ChartCard>

        {/* CA par Catégorie */}
        <ChartCard title="CA par Catégorie" subtitle="Répartition du chiffre d'affaires" delay={100}>
          <div className="h-64">
            {caCategories.length > 0 ? <Doughnut data={categorieChartData} options={doughnutOptions} /> : <EmptyChart />}
          </div>
          {caCategories.length > 0 && (
            <div className="mt-4 space-y-2">
              {caCategories.map((c, i) => (
                <AnimatedRow key={c._id} delay={i * 80}>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: categorieColors[i % categorieColors.length] }}></span>
                      <span className="font-medium text-gray-700">{c._id}</span>
                    </div>
                    <span className="font-bold text-gray-900">{formatPrice(c.ca_total)}</span>
                  </div>
                </AnimatedRow>
              ))}
            </div>
          )}
        </ChartCard>

        {/* Répartition des Commandes */}
        <ChartCard title="Statut des Commandes" subtitle="Répartition par statut" delay={150}>
          <div className="h-64">
            <Doughnut data={commandesPieData} options={doughnutOptions} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Livrées',   value: stats?.commandesLivrees   || 0, cls: 'bg-green-50',  txt: 'text-green-600',  sub: 'text-green-700'  },
              { label: 'En attente',value: stats?.commandesEnAttente  || 0, cls: 'bg-yellow-50', txt: 'text-yellow-600', sub: 'text-yellow-700' },
              { label: 'Annulées',  value: stats?.commandesAnnulees   || 0, cls: 'bg-red-50',    txt: 'text-red-600',    sub: 'text-red-700'    },
            ].map((item, i) => (
              <AnimatedRow key={item.label} delay={i * 100}>
                <div className={`${item.cls} rounded-xl p-3`}>
                  <AnimatedNumber value={item.value} className={`text-xl font-black ${item.txt}`} />
                  <p className={`text-xs font-medium ${item.sub}`}>{item.label}</p>
                </div>
              </AnimatedRow>
            ))}
          </div>
        </ChartCard>

        {/* CA par Ville */}
        <ChartCard title="CA par Ville" subtitle="Performance géographique" delay={200}>
          <div className="h-64">
            {caVilles.length > 0 ? <Bar data={villesChartData} options={chartOptions} /> : <EmptyChart />}
          </div>
        </ChartCard>

        {/* Top Produits */}
        <ChartCard title="Top 10 Produits" subtitle="Produits les plus vendus sur la plateforme" delay={250}>
          <div className="h-64">
            {topProduits.length > 0
              ? <Bar data={topProduitsChartData} options={{ ...chartOptions, indexAxis: 'y' }} />
              : <EmptyChart />}
          </div>
        </ChartCard>
      </div>

      {/* Bottom Info Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Vendeurs */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 card-hover anim-fade-up" style={{ animationDelay: '100ms' }}>
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
              <AnimatedRow key={v._id} delay={i * 80}>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
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
              </AnimatedRow>
            ))}
          </div>
        </div>

        {/* Stock Critique */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 card-hover anim-fade-up" style={{ animationDelay: '200ms' }}>
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
            {stockCritique.map((p, i) => (
              <AnimatedRow key={p._id} delay={i * 70}>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {p.images?.[0]
                      ? <img src={p.images[0]} alt={p.nom} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><FiBox className="text-gray-300" size={18}/></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{p.nom}</p>
                    <p className="text-xs text-gray-500">{p.categorie}</p>
                  </div>
                  <StockBar stock={p.stock} />
                  <div className="text-right shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                      p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {p.stock === 0 ? 'Rupture !' : `${p.stock} restants`}
                    </span>
                  </div>
                </div>
              </AnimatedRow>
            ))}
          </div>
        </div>

        {/* Dernières Inscriptions */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:col-span-2 card-hover anim-fade-up" style={{ animationDelay: '300ms' }}>
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
            {(stats?.dernierInscrit || []).map((u, i) => (
              <AnimatedRow key={u._id} delay={i * 80}>
                <div className="bg-gray-50 rounded-2xl p-4 text-center hover:shadow-sm transition-all card-hover">
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
              </AnimatedRow>
            ))}
          </div>
        </div>

        {/* Historique des Abonnements */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:col-span-2 card-hover anim-fade-up" style={{ animationDelay: '400ms' }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-black text-gray-900">Derniers Abonnements</h2>
              <p className="text-xs text-gray-500 mt-0.5">Historique récent des paiements vendeurs</p>
            </div>
            <Link to="/admin/abonnements" className="text-purple-600 hover:text-purple-700 text-sm font-bold flex items-center gap-1">
              Gérer tout <FiArrowRight size={14}/>
            </Link>
          </div>
          <div className="space-y-3">
            {abonnements.length === 0 && <p className="text-center text-gray-400 py-8">Aucun abonnement récent</p>}
            {abonnements.map((abo, i) => (
              <AnimatedRow key={abo._id} delay={i * 90}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${
                      abo.statut === 'actif'   ? 'bg-green-100 text-green-600' :
                      abo.statut === 'alerte'  ? 'bg-yellow-100 text-yellow-600' :
                      abo.statut === 'bloqué'  ? 'bg-red-100 text-red-600' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {abo.statut === 'actif'  ? <FiCheckCircle /> :
                       abo.statut === 'alerte' ? <FiAlertTriangle /> :
                       abo.statut === 'bloqué' ? <FiXCircle /> :
                       <FiClock />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{abo.vendeur?.nom || 'Vendeur inconnu'}</p>
                      <p className="text-xs text-gray-500">{abo.vendeur?.email || '—'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${abo.type === 'annuel' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {abo.type}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <FiCreditCard size={12}/> {abo.mode_paiement}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end text-left sm:text-right border-t sm:border-t-0 border-gray-200 pt-3 sm:pt-0">
                    <p className="font-black text-lg text-gray-900">{formatPrice(abo.montant)}</p>
                    <p className="text-xs font-medium text-gray-500">Payé le {formatDate(abo.date_paiement)}</p>
                    <p className={`text-xs mt-1 font-bold ${
                      abo.statut === 'actif'  ? 'text-green-600' :
                      abo.statut === 'bloqué' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      Expire le {formatDate(abo.date_fin)}
                    </p>
                  </div>
                </div>
              </AnimatedRow>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Petit helper pour nombre animé inline ────────────────────────────────────
const AnimatedNumber = ({ value, className }) => {
  const [ref, inView] = useInView();
  const animated = useCountUp(value, 1000, inView);
  return <p ref={ref} className={className}>{animated.toLocaleString('fr-FR')}</p>;
};

export default AdminDashboard;
