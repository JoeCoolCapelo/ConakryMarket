import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity, clearCart, selectCartItems, selectCartTotal, selectCartCount } from '../store/cartSlice';
import toast from 'react-hot-toast';

export const useCart = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const count = useSelector(selectCartCount);

  const addItem = (product, quantity = 1) => {
    dispatch(addToCart({ ...product, quantity }));
    toast.success('Ajouté au panier');
  };

  const removeItem = (id) => {
    dispatch(removeFromCart(id));
    toast.success('Retiré du panier');
  };

  const updateQty = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const clear = () => {
    dispatch(clearCart());
  };

  return {
    items,
    total,
    count,
    addItem,
    removeItem,
    updateQty,
    clear,
  };
};
