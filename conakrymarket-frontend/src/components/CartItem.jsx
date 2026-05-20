import React from 'react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/formatPrice';

const CartItem = ({ item }) => {
  const { updateQty, removeItem } = useCart();

  const handleIncrease = () => {
    if (item.quantity < item.stock) {
      updateQty(item._id, item.quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQty(item._id, item.quantity - 1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-6 border-b border-gray-100 last:border-0 group">
      <Link to={`/produit/${item._id}`} className="shrink-0">
        <img 
          src={item.images?.[0] || 'https://via.placeholder.com/100x100'} 
          alt={item.nom} 
          className="w-24 h-24 object-cover rounded-xl border border-gray-200"
        />
      </Link>
      
      <div className="flex-1 flex flex-col justify-between w-full">
        <div className="flex justify-between items-start gap-4">
          <div>
            <Link to={`/produit/${item._id}`} className="text-lg font-semibold text-accent-dark hover:text-primary transition-colors line-clamp-2">
              {item.nom}
            </Link>
            <p className="text-sm text-gray-500 mt-1">{item.categorie}</p>
          </div>
          <p className="font-bold text-lg text-primary whitespace-nowrap">
            {formatPrice(item.prix)}
          </p>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
            <button 
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm disabled:opacity-50 transition-all text-gray-600"
            >
              <FiMinus />
            </button>
            <span className="w-8 text-center font-medium text-gray-700">{item.quantity}</span>
            <button 
              onClick={handleIncrease}
              disabled={item.quantity >= item.stock}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm disabled:opacity-50 transition-all text-gray-600"
            >
              <FiPlus />
            </button>
          </div>
          
          <div className="flex items-center gap-6">
            <p className="font-bold text-accent-dark">
              Total: {formatPrice(item.prix * item.quantity)}
            </p>
            <button 
              onClick={() => removeItem(item._id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
              title="Retirer"
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
