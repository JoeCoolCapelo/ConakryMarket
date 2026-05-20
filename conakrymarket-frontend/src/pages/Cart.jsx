import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiArrowRight, FiShield, FiTruck } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/CartItem';
import { formatPrice } from '../utils/formatPrice';

const Cart = () => {
  const { items, total, count, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
            <FiShoppingBag size={48} />
          </div>
          <h2 className="text-3xl font-bold text-accent-dark mb-4">Votre panier est vide</h2>
          <p className="text-gray-500 mb-8 max-w-md">
            Parcourez notre catalogue pour découvrir des produits exceptionnels et les ajouter à votre panier.
          </p>
          <Link 
            to="/catalogue" 
            className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-primary/30 flex items-center gap-2"
          >
            Découvrir nos produits <FiArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-black text-accent-dark mb-8">Mon Panier ({count} articles)</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Items List */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
              <h2 className="font-bold text-lg text-gray-700">Articles</h2>
              <button 
                onClick={clear}
                className="text-sm text-red-500 hover:text-red-700 hover:underline font-medium"
              >
                Vider le panier
              </button>
            </div>
            
            <div className="flex flex-col">
              {items.map(item => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-primary/20 sticky top-24">
            <h2 className="font-bold text-xl text-accent-dark mb-6 border-b border-gray-100 pb-4">Résumé de la commande</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frais de livraison</span>
                <span className="font-medium text-secondary">Calculés à l'étape suivante</span>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-lg text-accent-dark">Total estimé</span>
                <span className="font-black text-2xl text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            <Link 
              to="/commande/nouvelle"
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary/30"
            >
              Passer commande <FiArrowRight />
            </Link>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <FiShield className="text-secondary shrink-0" size={18} />
                <span>Paiement 100% sécurisé</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <FiTruck className="text-secondary shrink-0" size={18} />
                <span>Livraison partout en Guinée</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
