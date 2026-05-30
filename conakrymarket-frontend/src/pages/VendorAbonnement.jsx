import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiClock, FiCreditCard } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { updateUser } from '../store/authSlice';
import abonnementService from '../services/abonnementService';
import { formatDate } from '../utils/formatDate';
import { formatPrice } from '../utils/formatPrice';

const VendorAbonnement = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState('mensuel');
  const [modePaiement, setModePaiement] = useState('Orange Money');
  const [numeroPaiement, setNumeroPaiement] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [monAbonnement, setMonAbonnement] = useState(null);
  const [historique, setHistorique] = useState([]);

  useEffect(() => {
    const fetchAbo = async () => {
      try {
        const data = await abonnementService.getMonAbonnement();
        setMonAbonnement(data.abonnement);
        setHistorique(data.historique || []);
      } catch (error) {
        toast.error('Erreur lors du chargement de votre abonnement');
      } finally {
        setIsFetching(false);
      }
    };
    fetchAbo();
  }, []);

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
        code_marchand: '620123456'
      });

      // Mettre à jour l'utilisateur localement pour le débloquer
      dispatch(updateUser({ 
        ...user, 
        compte_bloque: false, 
        statut_abonnement: 'actif' 
      }));

      toast.success('Paiement réussi ! Votre abonnement est activé.');
      
      // Recharger les données
      const data = await abonnementService.getMonAbonnement();
      setMonAbonnement(data.abonnement);
      setHistorique(data.historique || []);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors du paiement');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* En-tête Statut */}
        {user?.compte_bloque ? (
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
        ) : monAbonnement ? (
          <div className={`p-6 rounded-2xl border ${
            monAbonnement.statut === 'actif' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  monAbonnement.statut === 'actif' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {monAbonnement.statut === 'actif' ? <FiCheckCircle size={24} /> : <FiAlertCircle size={24} />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Abonnement {monAbonnement.statut === 'actif' ? 'Actif' : 'en Alerte'}
                  </h2>
                  <p className="text-gray-600">
                    Forfait <span className="font-bold capitalize">{monAbonnement.type}</span>, expire le <span className="font-bold">{formatDate(monAbonnement.date_fin)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-extrabold text-gray-900">Abonnement Vendeur</h1>
            <p className="text-gray-500">Choisissez un forfait pour commencer à vendre.</p>
          </div>
        )}

        {/* Section de Paiement (Plans + Formulaire) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {user?.compte_bloque || !monAbonnement ? 'Choisir un forfait' : 'Renouveler ou changer de forfait'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                    selectedPlan === plan.id ? 'border-primary shadow-lg bg-primary/5' : 'border-gray-200 shadow-sm bg-white'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-2">
                      <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        Recommandé
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900">{plan.title}</h3>
                    <div className="mt-2 flex items-baseline justify-center text-3xl font-extrabold text-gray-900">
                      {plan.price}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{plan.duration}</p>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <FiCheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Procéder au paiement</h2>
            
            {/* Simulation d'instructions de paiement avec code marchand */}
            {(modePaiement === 'Orange Money' || modePaiement === 'Mobile Money') && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h4 className="font-semibold text-blue-900 mb-2">Instructions de paiement {modePaiement}</h4>
                <p className="text-blue-800 text-sm mb-3">
                  Veuillez composer le code USSD suivant sur votre téléphone pour effectuer le paiement :
                </p>
                <div className="bg-white px-4 py-3 rounded-lg font-mono text-center text-xl font-bold text-gray-800 border border-blue-100 shadow-sm">
                  {modePaiement === 'Orange Money' 
                    ? `*144*4*1*620123456*${selectedPlan === 'mensuel' ? '50000' : '500000'}#`
                    : `*112*4*620123456*${selectedPlan === 'mensuel' ? '50000' : '500000'}#`
                  }
                </div>
                <p className="text-blue-600 text-xs mt-3 text-center">
                  * Code Marchand ConakryMarket : <span className="font-bold text-sm">620123456</span>
                </p>
              </div>
            )}

            <form onSubmit={handlePayment} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mode de paiement</label>
                  <select
                    value={modePaiement}
                    onChange={(e) => setModePaiement(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                  >
                    <option value="Orange Money">Orange Money</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Virement">Virement Bancaire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Votre Numéro de téléphone</label>
                  <input
                    type="text"
                    placeholder="Ex: 620 XX XX XX"
                    value={numeroPaiement}
                    onChange={(e) => setNumeroPaiement(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 flex justify-center items-center"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  `Confirmer le paiement de ${selectedPlan === 'mensuel' ? '50 000 GNF' : '500 000 GNF'}`
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Historique des abonnements */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mt-10">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FiClock className="text-primary" /> Historique de vos abonnements
            </h2>
          </div>
          <div className="p-6">
            {historique.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Aucun historique de paiement disponible.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4 font-semibold rounded-tl-xl">Date paiement</th>
                      <th className="p-4 font-semibold">Type</th>
                      <th className="p-4 font-semibold">Montant</th>
                      <th className="p-4 font-semibold">Mode</th>
                      <th className="p-4 font-semibold">Statut</th>
                      <th className="p-4 font-semibold rounded-tr-xl">Expiration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {historique.map((abo) => (
                      <tr key={abo._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-medium text-gray-800">{formatDate(abo.date_paiement)}</td>
                        <td className="p-4">
                          <span className="capitalize font-medium text-gray-700">{abo.type}</span>
                        </td>
                        <td className="p-4 font-bold text-gray-900">{formatPrice(abo.montant)}</td>
                        <td className="p-4 text-gray-600 flex items-center gap-1.5">
                          <FiCreditCard size={14} className="text-gray-400"/> {abo.mode_paiement}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            abo.statut === 'actif' ? 'bg-green-100 text-green-700' :
                            abo.statut === 'alerte' ? 'bg-yellow-100 text-yellow-700' :
                            abo.statut === 'bloqué' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {abo.statut}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500">{formatDate(abo.date_fin)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default VendorAbonnement;
