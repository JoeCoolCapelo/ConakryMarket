import React, { useEffect, useState, useMemo } from 'react';
import { getMesCommandes } from '../services/commandes';
import { formatPrice } from '../utils/formatPrice';
import { formatDate } from '../utils/formatDate';
import { FiPackage, FiCreditCard, FiSearch, FiFilter } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'livré', label: 'Livré' },
  { value: 'annulé', label: 'Annulé' },
];

const OrderHistory = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const data = await getMesCommandes();
        setCommandes(data);
      } catch (error) {
        console.error("Erreur commandes", error);
      } finally {
        setLoading(false);
      }
    };
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'en_attente': return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold border border-yellow-200">En attente</span>;
      case 'livré': return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold border border-green-200">Livré</span>;
      case 'annulé': return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold border border-red-200">Annulé</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <FiPackage size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-accent-dark">Mes Commandes</h1>
          <p className="text-gray-500 text-sm mt-0.5">{commandes.length} commande(s) au total</p>
        </div>
      </div>

      {/* Filtres */}
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

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <FiPackage size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-700">
            {commandes.length === 0 ? 'Aucune commande' : 'Aucun résultat'}
          </h2>
          <p className="text-gray-500 mt-2">
            {commandes.length === 0
              ? "Vous n'avez pas encore passé de commande."
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

                <div className="bg-primary/5 rounded-xl p-3 border border-primary/10 mb-4 mt-auto">
                  <h4 className="font-bold text-primary mb-1 text-xs uppercase tracking-wide">Livraison & Paiement</h4>
                  <p className="text-xs text-gray-700 font-medium line-clamp-1">
                    {cmd.adresse_livraison?.quartier}, {cmd.adresse_livraison?.ville}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-1.5 font-bold flex items-center gap-1">
                    <FiCreditCard size={12} className="text-primary"/> {cmd.mode_paiement}
                  </p>
                </div>

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

export default OrderHistory;
