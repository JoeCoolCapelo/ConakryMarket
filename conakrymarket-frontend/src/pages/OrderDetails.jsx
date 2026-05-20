import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCommande } from '../services/commandes';
import { formatPrice } from '../utils/formatPrice';
import { formatDate } from '../utils/formatDate';
import { FiArrowLeft, FiBox, FiCreditCard, FiTruck } from 'react-icons/fi';

const OrderDetails = () => {
  const { id } = useParams();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getCommande(id);
        setCommande(data);
      } catch (error) {
        console.error("Erreur chargement détails commande", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'en_attente': return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold border border-yellow-200">En attente</span>;
      case 'livré': return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold border border-green-200">Livré</span>;
      case 'annulé': return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold border border-red-200">Annulé</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!commande) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Commande introuvable</h2>
        <Link to="/mes-commandes" className="text-primary hover:underline mt-4 inline-block">Retour aux commandes</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
      <Link to="/mes-commandes" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold mb-6">
        <FiArrowLeft /> Retour aux commandes
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Commande <span className="text-primary font-mono">{commande._id.slice(-8).toUpperCase()}</span></h1>
          <p className="text-gray-500 font-medium mt-1">Passée le {formatDate(commande.createdAt)}</p>
        </div>
        <div>
          {getStatusBadge(commande.statut)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne gauche : Articles */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <FiBox className="text-primary" /> Articles commandés ({commande.articles?.length || 0})
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {commande.articles?.map((article, idx) => (
                <div key={idx} className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-gray-50/50 transition-colors">
                  {/* Photo du produit */}
                  <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                    {article.image ? (
                      <img src={article.image} alt={article.nom} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiBox size={32} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 w-full">
                    <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">{article.categorie}</p>
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-2">{article.nom}</h3>
                    
                    <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-black">Qté: {article.quantite}</span>
                        <span className="text-gray-500 font-medium">{formatPrice(article.prix_unit)} / u</span>
                      </div>
                      <p className="font-black text-gray-900 text-xl">{formatPrice(article.prix_unit * article.quantite)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne droite : Résumé & Livraison */}
        <div className="space-y-6">
          {/* Résumé */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-black text-gray-900 mb-4 border-b border-gray-100 pb-3">Résumé de la commande</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Sous-total</span>
                <span>{formatPrice(commande.montant_total)}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Frais de livraison</span>
                <span className="text-green-600 font-bold">Gratuit</span>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
              <span className="font-bold text-gray-900">Total à payer</span>
              <span className="text-2xl font-black text-primary">{formatPrice(commande.montant_total)}</span>
            </div>
          </div>

          {/* Info Livraison */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-black text-gray-900 mb-4 border-b border-gray-100 pb-3 flex items-center gap-2">
              <FiTruck className="text-primary" /> Livraison
            </h2>
            <div className="space-y-1">
              <p className="font-bold text-gray-800">{commande.adresse_livraison.ville}</p>
              <p className="text-gray-600">{commande.adresse_livraison.quartier}</p>
              {commande.adresse_livraison.details && (
                <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                  {commande.adresse_livraison.details}
                </p>
              )}
            </div>
          </div>

          {/* Paiement */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-black text-gray-900 mb-4 border-b border-gray-100 pb-3 flex items-center gap-2">
              <FiCreditCard className="text-primary" /> Paiement
            </h2>
            <p className="font-bold text-gray-800">{commande.mode_paiement}</p>
            <p className="text-sm text-gray-500 mt-1">Le paiement sera effectué lors de la livraison.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
