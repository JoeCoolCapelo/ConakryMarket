import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { createCommande } from '../services/commandes';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiTruck, FiCreditCard } from 'react-icons/fi';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clear } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const [formData, setFormData] = useState({
    ville: 'Conakry',
    quartier: '',
    details_adresse: '',
    methode_paiement: 'Espèces',
    type_carte: 'Visa', // default card
    numero_carte: '',
    expiration: '',
    cvv: '',
    telephone_orange: '' // for Orange Money
  });

  // Si panier vide et pas de succès, on redirige
  if (items.length === 0 && !success) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
        <Link to="/catalogue" className="text-primary hover:underline">Retour au catalogue</Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const orderData = {
        articles: items.map(i => ({ pid: i.pid, quantite: i.quantity })),
        adresse_livraison: {
          ville: formData.ville,
          quartier: formData.quartier,
          details: formData.details_adresse
        },
        mode_paiement: formData.methode_paiement
      };
      
      const res = await createCommande(orderData);
      setOrderId(res._id);
      setSuccess(true);
      clear();
      toast.success('Commande validée avec succès !');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la validation');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
            <FiCheckCircle size={48} />
          </div>
          <h1 className="text-3xl font-black text-accent-dark mb-4">Commande confirmée !</h1>
          <p className="text-gray-600 mb-2">Merci pour votre achat. Votre numéro de commande est :</p>
          <p className="text-2xl font-mono font-bold text-primary bg-primary/5 py-3 rounded-lg mb-8">{orderId}</p>
          
          <div className="space-y-4">
            <Link 
              to="/mes-commandes" 
              className="block w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary/30"
            >
              Suivre ma commande
            </Link>
            <Link 
              to="/catalogue" 
              className="block w-full bg-gray-50 hover:bg-gray-100 text-accent-dark border border-gray-200 py-4 rounded-xl font-bold text-lg transition-all"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const FRAIS_LIVRAISON = formData.ville === 'Conakry' ? 20000 : 50000;
  const grandTotal = total + FRAIS_LIVRAISON;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-black text-accent-dark mb-8">Validation de la commande</h1>
      
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-8">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Adresse */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="flex items-center gap-2 text-xl font-bold text-accent-dark mb-6 border-b border-gray-100 pb-4">
                <FiTruck className="text-primary" /> Adresse de livraison
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                  <select 
                    name="ville" 
                    value={formData.ville} 
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                    required
                  >
                    <option value="Conakry">Conakry</option>
                    <option value="Kindia">Kindia</option>
                    <option value="Labé">Labé</option>
                    <option value="Kankan">Kankan</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quartier</label>
                  <input 
                    type="text" 
                    name="quartier" 
                    value={formData.quartier} 
                    onChange={handleChange}
                    placeholder="Ex: Kipé, Dixinn, etc."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Détails (Optionnel)</label>
                  <textarea 
                    name="details_adresse" 
                    value={formData.details_adresse} 
                    onChange={handleChange}
                    placeholder="Instructions pour le livreur (ex: À côté de la mosquée)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px]"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Paiement */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="flex items-center gap-2 text-xl font-bold text-accent-dark mb-6 border-b border-gray-100 pb-4">
                <FiCreditCard className="text-primary" /> Méthode de paiement
              </h2>
              
              <div className="grid grid-cols-1 gap-4 mb-6">
                {['Orange Money', 'Espèces', 'Carte'].map((method) => (
                  <label key={method} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.methode_paiement === method ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name="methode_paiement" 
                      value={method} 
                      checked={formData.methode_paiement === method}
                      onChange={handleChange}
                      className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="ml-3 font-medium text-gray-900">{method}</span>
                  </label>
                ))}
              </div>

              {formData.methode_paiement === 'Orange Money' && (
                <div className="p-5 bg-orange-50 border border-orange-100 rounded-xl space-y-4 mb-4">
                  <h3 className="font-bold text-orange-600">Paiement Orange Money</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de téléphone Orange</label>
                    <input 
                      type="tel" 
                      name="telephone_orange" 
                      value={formData.telephone_orange} 
                      onChange={handleChange}
                      placeholder="Ex: 620 XX XX XX"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              {formData.methode_paiement === 'Carte' && (
                <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-6">
                  <h3 className="font-bold text-accent-dark">Détails de la carte</h3>
                  
                  {/* Choix du type de carte */}
                  <div className="grid grid-cols-3 gap-3">
                    {['Visa', 'MasterCard', 'PayCard'].map((carte) => (
                      <label key={carte} className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${formData.type_carte === carte ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'}`}>
                        <input 
                          type="radio" 
                          name="type_carte" 
                          value={carte} 
                          checked={formData.type_carte === carte}
                          onChange={handleChange}
                          className="hidden"
                        />
                        <span className="text-sm">{carte}</span>
                      </label>
                    ))}
                  </div>

                  {/* Infos de la carte */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de carte</label>
                      <input 
                        type="text" 
                        name="numero_carte" 
                        value={formData.numero_carte} 
                        onChange={handleChange}
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiration</label>
                        <input 
                          type="text" 
                          name="expiration" 
                          value={formData.expiration} 
                          onChange={handleChange}
                          placeholder="MM/AA"
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input 
                          type="text" 
                          name="cvv" 
                          value={formData.cvv} 
                          onChange={handleChange}
                          placeholder="123"
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Résumé */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-primary/20 sticky top-24">
            <h2 className="font-bold text-xl text-accent-dark mb-6 border-b border-gray-100 pb-4">Votre commande</h2>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {items.map(item => (
                <div key={item._id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="font-medium text-gray-500">{item.quantity}x</span>
                    <span className="text-gray-800 line-clamp-1">{item.nom}</span>
                  </div>
                  <span className="font-medium text-gray-800 shrink-0 ml-4">{formatPrice(item.prix * item.quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 border-t border-gray-100 pt-6 mb-6 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frais de livraison ({formData.ville})</span>
                <span className="font-medium text-secondary">{formatPrice(FRAIS_LIVRAISON)}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-lg text-accent-dark">Total à payer</span>
                <span className="font-black text-2xl text-primary">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button 
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full flex items-center justify-center bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Confirmer la commande'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
