import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { updateUser } from '../store/authSlice';
import abonnementService from '../services/abonnementService';

const VendorAbonnement = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState('mensuel');
  const [modePaiement, setModePaiement] = useState('Orange Money');
  const [numeroPaiement, setNumeroPaiement] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const plans = [
    {
      id: 'mensuel',
      title: 'Mensuel',
      price: '50 000 GNF',
      duration: 'par mois',
      features: ['Accès illimité', 'Support prioritaire', 'Boutique personnalisée'],
      popular: false
    },
    {
      id: 'annuel',
      title: 'Annuel',
      price: '500 000 GNF',
      duration: 'par an',
      features: ['Accès illimité', 'Support 24/7', 'Mise en avant', 'Économisez 100 000 GNF'],
      popular: true
    }
  ];

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!numeroPaiement) {
      toast.error('Veuillez entrer un numéro de paiement');
      return;
    }

    setIsLoading(true);
    try {
      await abonnementService.payerAbonnement({
        type: selectedPlan,
        mode_paiement: modePaiement,
        numero_paiement: numeroPaiement,
        code_marchand: '620123456' // Code marchand simulé
      });

      // Mettre à jour l'utilisateur localement pour le débloquer
      dispatch(updateUser({ 
        ...user, 
        compte_bloque: false, 
        statut_abonnement: 'actif' 
      }));

      toast.success('Paiement réussi ! Votre abonnement est activé.');
      navigate('/vendeur/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors du paiement');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"
          >
            <FiAlertCircle className="w-8 h-8 text-red-600" />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Votre compte est actuellement bloqué
          </h1>
          <p className="max-w-xl mx-auto text-lg text-gray-500">
            Pour continuer à vendre sur ConakryMarket et gérer vos produits, vous devez activer ou renouveler votre abonnement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative bg-white rounded-2xl border-2 p-8 cursor-pointer transition-all ${
                selectedPlan === plan.id ? 'border-primary-600 shadow-xl' : 'border-gray-200 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-4">
                  <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                    Recommandé
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">{plan.title}</h3>
                <div className="mt-4 flex items-baseline justify-center text-4xl font-extrabold text-gray-900">
                  {plan.price}
                </div>
                <p className="mt-1 text-gray-500">{plan.duration}</p>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <FiCheckCircle className="h-5 w-5 text-primary-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <div className={`w-full py-3 rounded-lg text-center font-medium transition-colors ${
                  selectedPlan === plan.id 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}>
                  {selectedPlan === plan.id ? 'Sélectionné' : 'Choisir'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mt-10"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Procéder au paiement</h2>
          
          {/* Simulation d'instructions de paiement avec code marchand */}
          {(modePaiement === 'Orange Money' || modePaiement === 'Mobile Money') && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Instructions de paiement {modePaiement}</h4>
              <p className="text-blue-800 text-sm mb-2">
                Pour payer, veuillez composer le code USSD suivant sur votre téléphone :
              </p>
              <div className="bg-white px-4 py-3 rounded-md font-mono text-center text-lg font-bold text-gray-800 border border-blue-100 shadow-sm">
                {modePaiement === 'Orange Money' 
                  ? `*144*4*1*620123456*${selectedPlan === 'mensuel' ? '50000' : '500000'}#`
                  : `*112*4*620123456*${selectedPlan === 'mensuel' ? '50000' : '500000'}#`
                }
              </div>
              <p className="text-blue-600 text-xs mt-3">
                * Code Marchand ConakryMarket : <span className="font-bold">620123456</span>
              </p>
            </div>
          )}

          <form onSubmit={handlePayment} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mode de paiement
                </label>
                <select
                  value={modePaiement}
                  onChange={(e) => setModePaiement(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Orange Money">Orange Money</option>
                  <option value="Mobile Money">Mobile Money</option>
                  <option value="Virement">Virement Bancaire</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre Numéro de téléphone
                </label>
                <input
                  type="text"
                  placeholder="Ex: 620 XX XX XX"
                  value={numeroPaiement}
                  onChange={(e) => setNumeroPaiement(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg shadow-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                `Confirmer le paiement de ${selectedPlan === 'mensuel' ? '50 000 GNF' : '500 000 GNF'}`
              )}
            </button>
          </form>
        </motion.div>

      </div>
    </div>
  );
};

export default VendorAbonnement;
