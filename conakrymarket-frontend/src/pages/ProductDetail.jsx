import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiShoppingCart, FiMinus, FiPlus, FiAlertCircle, FiCheck, FiUser } from 'react-icons/fi';
import { getProduit } from '../services/produits';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/formatPrice';
import ReviewCard from '../components/ReviewCard';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { pid } = useParams();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduit(pid);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [pid]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour ajouter au panier');
      navigate('/connexion');
      return;
    }
    if (product) {
      addItem(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Produit non trouvé</h2>
        <Link to="/catalogue" className="text-primary hover:underline">Retour au catalogue</Link>
      </div>
    );
  }

  const inStock = product.stock > 0;
  const images = product.images?.length > 0 ? product.images : ['https://via.placeholder.com/600x600?text=Pas+d%27image'];

  // Render specific attributes based on category
  const renderAttributes = () => {
    if (!product.attributs) return null;
    const { attributs, categorie } = product;
    
    switch (categorie) {
      case 'Électronique':
        return (
          <div className="grid grid-cols-2 gap-4 my-6 p-4 bg-gray-50 rounded-xl">
            {attributs.marque && <div><span className="text-gray-500 text-sm">Marque:</span> <p className="font-semibold">{attributs.marque}</p></div>}
            {attributs.modele && <div><span className="text-gray-500 text-sm">Modèle:</span> <p className="font-semibold">{attributs.modele}</p></div>}
            {attributs.processeur && <div><span className="text-gray-500 text-sm">Processeur:</span> <p className="font-semibold">{attributs.processeur}</p></div>}
            {attributs.ram_go && <div><span className="text-gray-500 text-sm">RAM:</span> <p className="font-semibold">{attributs.ram_go} Go</p></div>}
            {attributs.stockage_go && <div><span className="text-gray-500 text-sm">Stockage:</span> <p className="font-semibold">{attributs.stockage_go} Go</p></div>}
          </div>
        );
      case 'Vêtements':
        return (
          <div className="my-6 space-y-4 p-4 bg-gray-50 rounded-xl">
            {attributs.taille?.length > 0 && (
              <div>
                <span className="text-gray-500 text-sm block mb-1">Tailles disponibles:</span>
                <div className="flex gap-2">
                  {attributs.taille.map(t => <span key={t} className="px-3 py-1 bg-white border border-gray-200 rounded-md text-sm font-medium">{t}</span>)}
                </div>
              </div>
            )}
            {attributs.couleurs?.length > 0 && (
              <div>
                <span className="text-gray-500 text-sm block mb-1">Couleurs:</span>
                <div className="flex gap-2">
                  {attributs.couleurs.map(c => <span key={c} className="px-3 py-1 bg-white border border-gray-200 rounded-md text-sm capitalize">{c}</span>)}
                </div>
              </div>
            )}
            {attributs.matiere && <div><span className="text-gray-500 text-sm">Matière:</span> <p className="font-semibold">{attributs.matiere}</p></div>}
          </div>
        );
      case 'Alimentation':
        return (
          <div className="grid grid-cols-2 gap-4 my-6 p-4 bg-gray-50 rounded-xl">
            {attributs.poids_kg && <div><span className="text-gray-500 text-sm">Poids:</span> <p className="font-semibold">{attributs.poids_kg} kg</p></div>}
            {attributs.unite && <div><span className="text-gray-500 text-sm">Unité:</span> <p className="font-semibold">{attributs.unite}</p></div>}
            {attributs.peremption && <div><span className="text-gray-500 text-sm">Date limite:</span> <p className="font-semibold">{new Date(attributs.peremption).toLocaleDateString()}</p></div>}
          </div>
        );
      case 'Équipement agricole':
        return (
          <div className="grid grid-cols-2 gap-4 my-6 p-4 bg-gray-50 rounded-xl">
            {attributs.puissance_w && <div><span className="text-gray-500 text-sm">Puissance:</span> <p className="font-semibold">{attributs.puissance_w} W</p></div>}
            {attributs.garantie_mois && <div><span className="text-gray-500 text-sm">Garantie:</span> <p className="font-semibold">{attributs.garantie_mois} mois</p></div>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link to="/catalogue" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">
          ← Retour au catalogue
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-gray-100">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
            <img 
              src={images[activeImage]} 
              alt={product.nom} 
              className="w-full h-full object-cover object-center"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-200'}`}
                >
                  <img src={img} alt={`${product.nom} ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
              {product.categorie}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-accent-dark my-4 leading-tight">
            {product.nom}
          </h1>

          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">
              <div className="flex gap-0.5 mr-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar 
                    key={star} 
                    className={star <= Math.round(product.note_moyenne || 0) ? "text-yellow-500 fill-current" : "text-yellow-200"} 
                  />
                ))}
              </div>
              <span className="font-bold text-yellow-700">{product.note_moyenne?.toFixed(1) || '0.0'}</span>
              <span className="text-yellow-600 text-sm">({product.nombre_avis || 0} avis)</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <FiUser className="text-gray-400" />
              <span>Vendu par <span className="font-semibold text-gray-700">{product.vendeur?.nom || 'Inconnu'}</span></span>
            </div>
          </div>

          <div className="text-4xl font-black text-primary mb-6">
            {formatPrice(product.prix)}
          </div>

          <div className="mb-8 text-gray-600 leading-relaxed text-lg">
            {product.description}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <FiMapPin className="text-secondary" size={20} />
            <span className="text-gray-700 font-medium">Expédié depuis {product.ville_vendeur}</span>
          </div>

          {renderAttributes()}

          <div className="mt-auto border-t border-gray-100 pt-8">
            <div className="flex items-center gap-4 mb-6">
              {inStock ? (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg font-medium">
                  <FiCheck size={20} />
                  <span>En stock ({product.stock} disponibles)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg font-medium">
                  <FiAlertCircle size={20} />
                  <span>Rupture de stock</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-2 w-full sm:w-40">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                  disabled={!inStock}
                >
                  <FiMinus />
                </button>
                <span className="font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                  disabled={!inStock}
                >
                  <FiPlus />
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                  inStock 
                  ? 'bg-primary hover:bg-primary-dark text-white shadow-primary/30 hover:-translate-y-1' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                <FiShoppingCart size={24} />
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-accent-dark">Avis Clients ({product.nombre_avis || 0})</h2>
          <Link 
            to={`/avis/nouveau/${product._id}`} 
            className="text-primary font-medium hover:text-primary-dark hover:underline transition-colors"
          >
            Écrire un avis
          </Link>
        </div>

        {product.liste_avis && product.liste_avis.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.liste_avis.map(avis => (
              <ReviewCard key={avis._id} avis={avis} productId={product._id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-2xl">
            <p className="text-gray-500 mb-4">Aucun avis pour ce produit pour le moment.</p>
            <Link 
              to={`/avis/nouveau/${product._id}`} 
              className="inline-block px-6 py-2 bg-white border border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-colors"
            >
              Soyez le premier à donner votre avis
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
