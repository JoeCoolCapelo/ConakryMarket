import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiShoppingCart, FiMenu, FiX, FiUser, FiChevronDown, FiPackage, FiPieChart, FiClipboard } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { name: 'Électronique', param: 'Électronique' },
  { name: 'Vêtements', param: 'Vêtements' },
  { name: 'Alimentation', param: 'Alimentation' },
  { name: 'Équipement agricole', param: 'Équipement agricole' },
];

const Navbar = () => {
  const { user, isAuthenticated, isVendeur, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isOrdersDropdownOpen, setIsOrdersDropdownOpen] = useState(false);
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [isVendorDropdownOpen, setIsVendorDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsOrdersDropdownOpen(false);
    setIsVendorDropdownOpen(false);
    setIsAdminDropdownOpen(false);
  }, [location.pathname]);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm py-2' : 'bg-transparent py-4'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="w-10 h-10 rounded-xl overflow-hidden shadow-md border border-gray-100"
              >
                <img src="/logo.jpg" alt="ConakryMarket Logo" className="w-full h-full object-cover" />
              </motion.div>
              <span className="font-black text-xl tracking-tight text-gray-900 hidden sm:block group-hover:text-primary transition-colors">
                Conakry<span className="text-primary">Market</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-primary transition-colors font-bold text-xs tracking-wide uppercase">Accueil</Link>
            <Link to="/catalogue" className="text-gray-600 hover:text-primary transition-colors font-bold text-xs tracking-wide uppercase">Catalogue</Link>
            <div className="relative"
              onMouseEnter={() => setIsCatDropdownOpen(true)}
              onMouseLeave={() => setIsCatDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors font-bold text-xs tracking-wide uppercase">
                Catégories <FiChevronDown size={14} className={`transition-transform ${isCatDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isCatDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-3 w-56 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 overflow-hidden"
                  >
                    {CATEGORIES.map(cat => (
                      <Link
                        key={cat.param}
                        to={`/catalogue?categorie=${encodeURIComponent(cat.param)}`}
                        className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                    <div className="h-px bg-gray-100 my-1"></div>
                    <Link to="/catalogue" className="block px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary/5 transition-colors">
                      Toutes les catégories
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/panier" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
              <FiShoppingCart size={24} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                {/* Commandes Dropdown */}
                <div className="relative"
                  onMouseEnter={() => setIsOrdersDropdownOpen(true)}
                  onMouseLeave={() => setIsOrdersDropdownOpen(false)}
                >
                  <button className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors font-bold text-xs tracking-wide uppercase">
                    Commandes <FiChevronDown size={14} className={`transition-transform ${isOrdersDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOrdersDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 overflow-hidden"
                      >
                        <Link to="/mes-commandes" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors">
                          Historique d'achats
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Vendeur Dropdown */}
                {isVendeur && (
                  <div className="relative"
                    onMouseEnter={() => setIsVendorDropdownOpen(true)}
                    onMouseLeave={() => setIsVendorDropdownOpen(false)}
                  >
                    <button className="flex items-center gap-1 text-secondary hover:text-green-600 transition-colors font-bold text-xs tracking-wide uppercase">
                      Espace Vendeur <FiChevronDown size={14} className={`transition-transform ${isVendorDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isVendorDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 overflow-hidden"
                        >
                          <Link to="/vendeur/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors">
                            <FiPieChart size={16} /> Dashboard
                          </Link>
                          <Link to="/vendeur/produits" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors">
                            <FiPackage size={16} /> Mes Produits
                          </Link>
                          <Link to="/vendeur/commandes" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors">
                            <FiClipboard size={16} /> Commandes Clients
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Admin Dropdown */}
                {isAdmin && (
                  <div className="relative"
                    onMouseEnter={() => setIsAdminDropdownOpen(true)}
                    onMouseLeave={() => setIsAdminDropdownOpen(false)}
                  >
                    <button className="flex items-center gap-1 text-purple-600 hover:text-purple-700 transition-colors font-bold text-xs tracking-wide uppercase">
                      Admin <FiChevronDown size={14} className={`transition-transform ${isAdminDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isAdminDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 overflow-hidden"
                        >
                          <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                            <FiPieChart size={16} /> Vue d'ensemble
                          </Link>
                          <Link to="/admin/utilisateurs" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                            <FiUser size={16} /> Utilisateurs
                          </Link>
                          <Link to="/admin/produits" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                            <FiPackage size={16} /> Produits
                          </Link>
                          <Link to="/admin/commandes" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                            <FiClipboard size={16} /> Commandes
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Profile Dropdown */}
                <div className="relative"
                  onMouseEnter={() => setIsProfileDropdownOpen(true)}
                  onMouseLeave={() => setIsProfileDropdownOpen(false)}
                >
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 font-bold text-sm transition-colors">
                    {user?.photo_profil ? (
                      <img src={user.photo_profil} alt="Profil" className="w-6 h-6 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <FiUser size={18} />
                    )}
                    <span>{user?.nom?.split(' ')[0]}</span>
                    <FiChevronDown size={14} className={`transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 mb-2 bg-gray-50/50">
                          <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                        </div>
                        <Link to="/profil" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors">Mon profil</Link>
                        <div className="h-px bg-gray-100 my-2"></div>
                        <button onClick={logout} className="block w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">Déconnexion</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/connexion" className="text-gray-900 font-bold text-sm hover:text-primary px-3 py-1.5 transition-colors">Connexion</Link>
                <Link to="/inscription">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-full font-bold text-sm transition-colors shadow-md"
                  >
                    Inscription
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <Link to="/panier" className="relative p-2 text-gray-600">
              <FiShoppingCart size={24} />
              {count > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                  {count}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-900 focus:outline-none bg-gray-100 rounded-full">
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-2">
              <Link to="/" className="block px-4 py-3 text-lg font-bold text-gray-900 hover:bg-gray-50 rounded-xl">Accueil</Link>
              <Link to="/catalogue" className="block px-4 py-3 text-lg font-bold text-gray-900 hover:bg-gray-50 rounded-xl">Catalogue</Link>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="px-4 py-2 text-sm text-gray-500 font-medium uppercase tracking-wider">Catégories</p>
                {CATEGORIES.map(cat => (
                  <Link
                    key={cat.param}
                    to={`/catalogue?categorie=${encodeURIComponent(cat.param)}`}
                    className="block px-6 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              
              {isAuthenticated ? (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="px-4 mb-4">
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Compte</p>
                    <p className="font-bold text-gray-900 text-lg mt-1">{user?.nom}</p>
                  </div>
                  <Link to="/profil" className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl">Mon profil</Link>
                  <Link to="/mes-commandes" className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl">Mes commandes</Link>
                  {isVendeur && (
                    <>
                      <Link to="/vendeur/produits" className="flex items-center gap-2 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl"><FiPackage size={18} /> Mes Produits</Link>
                      <Link to="/vendeur/dashboard" className="flex items-center gap-2 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl"><FiPieChart size={18} /> Dashboard Vendeur</Link>
                    </>
                  )}
                  {isAdmin && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="px-4 py-2 text-sm text-purple-600 font-bold uppercase tracking-wider">Administration</p>
                      <Link to="/admin/dashboard" className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl">Vue d'ensemble</Link>
                      <Link to="/admin/utilisateurs" className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl">Utilisateurs</Link>
                      <Link to="/admin/produits" className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl">Produits</Link>
                      <Link to="/admin/commandes" className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl">Commandes</Link>
                    </div>
                  )}
                  <button onClick={logout} className="block w-full text-left px-4 py-3 mt-2 text-base font-bold text-red-600 hover:bg-red-50 rounded-xl">Déconnexion</button>
                </div>
              ) : (
                <div className="pt-6 mt-6 border-t border-gray-100 flex flex-col gap-3">
                  <Link to="/connexion" className="block text-center px-4 py-3.5 bg-gray-100 text-gray-900 rounded-xl font-bold">Connexion</Link>
                  <Link to="/inscription" className="block text-center px-4 py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30">Inscription</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
