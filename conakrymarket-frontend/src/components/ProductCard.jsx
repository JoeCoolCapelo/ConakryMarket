import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiShoppingCart, FiPlus } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/formatPrice';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour ajouter au panier');
      navigate('/connexion');
      return;
    }
    addItem(product, 1);
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Électronique': return 'bg-blue-500/80 text-white';
      case 'Vêtements': return 'bg-pink-500/80 text-white';
      case 'Alimentation': return 'bg-orange-500/80 text-white';
      case 'Équipement agricole': return 'bg-green-500/80 text-white';
      default: return 'bg-gray-500/80 text-white';
    }
  };

  const mainImage = product.images?.[0] || 'https://via.placeholder.com/300x300?text=Pas+d%27image';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
    >
      <Link 
        to={`/produit/${product._id}`} 
        className="group relative block bg-white/70 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 overflow-hidden border border-white/50"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100/50">
          <motion.img 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            src={mainImage} 
            alt={product.nom} 
            className="w-full h-full object-contain object-center p-4 bg-white"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=Pas+d%27image'; }}
          />
          
          {/* Badge catégorie avec glassmorphism */}
          <div className="absolute top-4 left-4 z-10">
            <span className={`text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm ${getCategoryColor(product.categorie)}`}>
              {product.categorie}
            </span>
          </div>
          
          {/* Overlay dégradé au hover pour le côté premium */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        
        <div className="p-4 relative">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm md:text-base font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-300">
              {product.nom}
            </h3>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3 font-medium">
            <FiMapPin className="text-secondary" size={12} />
            <span className="truncate">{product.ville_vendeur || 'Guinée'}</span>
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100/80">
            <div>
              <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                {formatPrice(product.prix)}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar 
                      key={star} 
                      size={10} 
                      className={star <= Math.round(product.note_moyenne || 0) ? "text-yellow-400 fill-current" : "text-gray-300"} 
                    />
                  ))}
                </div>
                <span className="font-semibold text-gray-700 text-xs">{product.note_moyenne?.toFixed(1) || '0.0'}</span>
                <span className="text-gray-400 text-[10px]">({product.nombre_avis || 0})</span>
              </div>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-colors ${
                product.stock > 0 
                ? 'bg-primary text-white hover:bg-primary-dark shadow-primary/30' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
              }`}
              title={product.stock > 0 ? "Ajouter au panier" : "Rupture de stock"}
            >
              {product.stock > 0 ? <FiPlus size={18} /> : <FiShoppingCart size={16} />}
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
