import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiSmartphone, FiShoppingBag, FiCoffee, FiSun, FiArrowRight, FiShield, FiTruck, FiCreditCard, FiUsers, FiPackage, FiCheckCircle, FiStore } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { getProduits } from '../services/produits';
import api from '../services/api';
import { motion } from 'framer-motion';

// Hook d'animation de compteur
const useCounter = (target, duration = 1500, started = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started || target === 0) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, started]);
  return count;
};

const Home = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalProduits: 0, totalCommandes: 0, totalVendeurs: 0 });
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, statsRes] = await Promise.all([
          getProduits({ limit: 8, sort: '-note_moyenne' }),
          api.get('/stats')
        ]);
        setTopProducts(productsRes.data || []);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching home data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Observer pour déclencher l'animation des compteurs
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const categories = [
    { name: 'Électronique', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80', color: 'from-blue-400 to-blue-600', shadow: 'shadow-blue-500/20' },
    { name: 'Vêtements', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', color: 'from-pink-400 to-pink-600', shadow: 'shadow-pink-500/20' },
    { name: 'Alimentation', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80', color: 'from-orange-400 to-orange-600', shadow: 'shadow-orange-500/20' },
    { name: 'Agriculture', image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80', color: 'from-green-400 to-green-600', shadow: 'shadow-green-500/20' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden bg-gray-900">
        {/* Background Image - Pure CSS to prevent any animation bugs */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div 
            className="absolute -inset-4 bg-cover bg-center bg-no-repeat blur-[4px] transform scale-105"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&q=80')" }}
          ></div>
          <div className="absolute inset-0 bg-gray-900/40 z-10"></div>
        </div>
        
        {/* Animated Background Shapes for extra premium feel */}
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/30 blur-[100px] opacity-60 z-10"
        ></motion.div>
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 -ml-20 w-72 h-72 rounded-full bg-secondary/30 blur-[100px] opacity-60 z-10"
        ></motion.div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 shadow-lg border border-white/20 text-white font-bold text-sm mb-6 uppercase tracking-wider backdrop-blur-md">
              Guinée 🇬🇳 • Achat & Vente en ligne
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-tight drop-shadow-2xl">
              Bienvenue sur <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-secondary">ConakryMarket</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed font-medium drop-shadow-md">
              L'expérience shopping premium numéro 1 en Guinée. Découvrez des milliers d'articles de qualité au meilleur prix.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link to="/catalogue">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-white px-8 py-3 rounded-full font-bold text-base shadow-[0_10px_40px_rgba(234,88,12,0.4)] hover:shadow-[0_15px_50px_rgba(234,88,12,0.6)] flex items-center gap-2 transition-all border border-primary-light/30"
                >
                  Explorer le catalogue <FiArrowRight />
                </motion.button>
              </Link>
              <Link to="/inscription">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-full font-bold text-base border border-white/30 shadow-lg hover:bg-white/20 flex items-center gap-2 transition-all"
                >
                  Devenir Vendeur
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Offres Spéciales */}
      <section className="py-16 bg-[#FDFDFD] relative z-20 -mt-10 rounded-t-3xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Offres Spéciales</h2>
              <p className="text-xl text-gray-500 mt-2">Profitez de réductions exclusives jusqu'à -50%</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Promo 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.01 }}
              className="relative rounded-3xl overflow-hidden shadow-lg h-64 md:h-80 group"
            >
              <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80" alt="Soldes Électronique" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/40"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-center text-left">
                <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-full w-max mb-4">Vente Flash</span>
                <h3 className="text-3xl font-black text-white mb-2 leading-tight max-w-[250px]">Smartphones & Laptops</h3>
                <p className="text-gray-300 mb-6 font-medium">Jusqu'à -30% sur les grandes marques</p>
                <Link to="/catalogue?categorie=Électronique">
                  <button className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-colors w-max">
                    Voir les offres
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Promo 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="relative rounded-3xl overflow-hidden shadow-lg h-64 md:h-80 group"
            >
              <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80" alt="Mode Homme et Femme" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-orange-500/40"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-center text-left">
                <span className="inline-block px-3 py-1 bg-white text-primary text-xs font-bold uppercase tracking-wider rounded-full w-max mb-4">Nouvelle Collection</span>
                <h3 className="text-3xl font-black text-white mb-2 leading-tight max-w-[250px]">Mode Vêtements</h3>
                <p className="text-white/90 mb-6 font-medium">Achetez 2 articles, le 3ème à -50%</p>
                <Link to="/catalogue?categorie=Vêtements">
                  <button className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-black transition-colors w-max">
                    J'en profite
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: <FiShield size={24} />, title: 'Paiement Sécurisé', desc: 'Orange Money, MTN ou Carte 100% sécurisés.', color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: <FiTruck size={24} />, title: 'Livraison Rapide', desc: 'Livraison partout à Conakry et en province.', color: 'text-green-500', bg: 'bg-green-50' },
              { icon: <FiCreditCard size={24} />, title: 'Paiement à la livraison', desc: 'Payez en espèces à la réception.', color: 'text-orange-500', bg: 'bg-orange-50' }
            ].map((feat, i) => (
              <motion.div key={i} variants={itemVariants} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all">
                <div className={`w-14 h-14 rounded-xl ${feat.bg} ${feat.color} flex items-center justify-center mb-4 transform -rotate-3`}>
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">{feat.title}</h3>
                <p className="text-sm text-gray-500 font-medium">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Nos Catégories</h2>
            <p className="text-xl text-gray-500">Trouvez exactement ce que vous cherchez</p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map((cat) => (
              <motion.div key={cat.name} variants={itemVariants} className="flex justify-center">
                <Link to={`/catalogue?categorie=${cat.name}`} className="group relative w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden block shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1.5">
                  {/* Glowing background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-md ${cat.shadow}`}></div>
                  
                  {/* Border Container */}
                  <div className={`absolute inset-0 rounded-full p-[3px] bg-gradient-to-br ${cat.color} z-10`}>
                    <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                      {/* Image background */}
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      {/* Dark overlay for readability */}
                      <div className="absolute inset-0 bg-gray-950/40 group-hover:bg-gray-950/50 transition-all duration-500 z-10"></div>
                      
                      {/* Text overlaid on top */}
                      <h3 className="relative z-20 text-white font-black text-base md:text-lg px-3 text-center leading-tight tracking-wide drop-shadow-lg">
                        {cat.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>



      {/* Top Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Produits Tendances</h2>
            <p className="text-xl text-gray-500 mb-6">Les articles les mieux notés de la semaine</p>
            <Link to="/catalogue">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 text-primary font-bold text-lg hover:text-primary-dark transition-colors bg-primary/10 px-6 py-2 rounded-full"
              >
                Voir tout le catalogue <FiArrowRight />
              </motion.button>
            </Link>
          </motion.div>
          
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 rounded-3xl h-[400px]"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {topProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-gray-900 to-gray-900"></div>
        {/* Décors animés */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-white tracking-tight mb-3">ConakryMarket en chiffres</h2>
            <p className="text-gray-400 text-lg">Des données réelles, mises à jour en temps réel</p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            <StatCard icon={<FiUsers size={28}/>} value={stats.totalUsers} label="Clients actifs" color="text-primary" started={statsVisible} />
            <StatCard icon={<FiStore size={28}/>} value={stats.totalVendeurs} label="Vendeurs" color="text-secondary" started={statsVisible} />
            <StatCard icon={<FiPackage size={28}/>} value={stats.totalProduits} label="Produits en ligne" color="text-yellow-400" started={statsVisible} />
            <StatCard icon={<FiCheckCircle size={28}/>} value={stats.totalCommandes} label="Commandes livrées" color="text-blue-400" started={statsVisible} />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Composant StatCard avec compteur animé
const StatCard = ({ icon, value, label, color, started }) => {
  const count = useCounter(value, 1800, started);
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
      className="flex flex-col items-center gap-3"
    >
      <div className={`w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center ${color} mb-1`}>
        {icon}
      </div>
      <p className={`text-5xl font-black ${color} tracking-tighter`}>
        {count.toLocaleString('fr-FR')}
      </p>
      <p className="text-gray-400 font-medium text-sm uppercase tracking-wide">{label}</p>
    </motion.div>
  );
};

export default Home;
