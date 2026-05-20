import React, { useEffect, useState, useMemo } from 'react';
import { getVendeurCommandes, updateStatut } from '../services/commandes';
import { formatDate } from '../utils/formatDate';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';
import { FiBox, FiCheck, FiX, FiCreditCard, FiSearch, FiFilter } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'livré', label: 'Livré' },
  { value: 'annulé', label: 'Annulé' },
];

const VendorOrders = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCommandes = async () => {
    try {
      const data = await getVendeurCommandes();
      setCommandes(data);
    } catch (error) {
      console.error('Erreur de chargement des commandes', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, []);

  const filtered = useMemo(() => {
    return commandes.filter(cmd => {
      const matchStatus = statusFilter ? cmd.statut === statusFilter : true;
      const matchSearch = search
        ? cmd._id.toLowerCase().includes(search.toLowerCase()) ||
          (cmd.oid && cmd.oid.toLowerCase().includes(search.toLowerCase()))
        : true;
      return matchStatus && matchSearch;
    });
  }, [commandes, search, statusFilter]);

  const handleUpdateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateStatut(id, status);
      toast.success(`Statut mis à jour : ${status}`);
      setCommandes(prev =>
        prev.map(cmd => cmd._id === id ? { ...cmd, statut: status } : cmd)
      );
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'en_attente': return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold border border-yellow-200">En attente</span>;
      case 'livré': return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold border border-green-200">Livré</span>;
      case 'annulé': return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold border border-red-200">Annulé</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <FiBox size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-accent-dark">Commandes Clients</h1>
          <p className="text-gray-500 mt-0.5 text-sm">Gérez les commandes contenant vos produits</p>
        </div>
      </div>

      {/* Barre de filtres */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Rechercher par N° de commande..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <div className="relative">
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none bg-white cursor-pointer"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {(search || statusFilter) && (
          <button
            onClick={() => { setSearch(''); setStatusFilter(''); }}
            className="px-4 py-2.5 text-sm text-gray-500 hover:text-primary border border-gray-200 rounded-xl hover:border-primary/30 transition-all font-medium"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Compteur résultats */}
      {!loading && (
        <p className="text-sm text-gray-500 mb-4">
          {filtered.length} commande(s) affichée(s) sur {commandes.length} au total
        </p>
      )}

      {loading ? (
        <div className="p-20 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <FiBox size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-700">
            {commandes.length === 0 ? 'Aucune commande' : 'Aucun résultat'}
          </h2>
          <p className="text-gray-500 mt-2">
            {commandes.length === 0
              ? "Vous n'avez pas encore reçu de commande."
              : "Essayez de modifier vos filtres de recherche."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(cmd => (
            <div key={cmd._id} className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg transition-all flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Commande N°</p>
                    <p className="font-mono text-gray-900 font-black text-sm">{cmd._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>{getStatusBadge(cmd.statut)}</div>
                </div>

                <div className="mb-4 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Total</p>
                    <p className="text-xl font-black text-primary">{formatPrice(cmd.montant_total)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Date</p>
                    <p className="text-xs font-bold text-gray-800">{formatDate(cmd.createdAt)}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 mb-4 mt-auto">
                  <h4 className="font-bold text-gray-800 mb-1 text-xs uppercase tracking-wide">Livraison & Paiement</h4>
                  <p className="text-xs text-gray-700 font-medium line-clamp-1">
                    {cmd.adresse_livraison?.quartier}, {cmd.adresse_livraison?.ville}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-1.5 font-bold flex items-center gap-1">
                    <FiCreditCard size={12} className="text-gray-500"/> Paiement : {cmd.mode_paiement}
                  </p>
                </div>

                {cmd.statut === 'en_attente' && (
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => handleUpdateStatus(cmd._id, 'livré')}
                      disabled={updatingId === cmd._id}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold transition-colors shadow-sm text-xs disabled:opacity-60"
                    >
                      {updatingId === cmd._id ? (
                        <div className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <FiCheck size={14} />
                      )}
                      Livré
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(cmd._id, 'annulé')}
                      disabled={updatingId === cmd._id}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-bold transition-colors shadow-sm text-xs disabled:opacity-60"
                    >
                      <FiX size={14} /> Annuler
                    </button>
                  </div>
                )}

                <Link
                  to={`/commande/${cmd._id}`}
                  className="w-full py-2 rounded-lg border border-gray-200 text-primary font-bold hover:bg-primary/5 hover:border-primary/30 flex items-center justify-center gap-1.5 transition-colors text-xs"
                >
                  Détails complets ({cmd.articles?.length || 0} articles)
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
