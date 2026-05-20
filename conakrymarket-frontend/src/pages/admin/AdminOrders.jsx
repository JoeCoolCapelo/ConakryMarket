import React, { useEffect, useState, useMemo } from 'react';
import { getAllCommandes } from '../../services/admin';
import { updateStatut } from '../../services/commandes';
import { formatDate } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';
import { FiBox, FiSearch, FiFilter, FiCheck, FiX, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'livré', label: 'Livré' },
  { value: 'annulé', label: 'Annulé' },
];

const AdminOrders = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCommandes = async () => {
    try {
      const data = await getAllCommandes();
      setCommandes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, []);

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
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = useMemo(() => {
    return commandes.filter(cmd => {
      const matchStatus = statusFilter ? cmd.statut === statusFilter : true;
      const matchSearch = search
        ? cmd._id.toLowerCase().includes(search.toLowerCase()) ||
          (cmd.oid && cmd.oid.toLowerCase().includes(search.toLowerCase())) ||
          (cmd.client_uid && cmd.client_uid.toLowerCase().includes(search.toLowerCase()))
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-accent-dark">Toutes les Commandes</h1>
        <p className="text-gray-500 mt-1">Gérez et suivez les commandes de l'ensemble du marché ({filtered.length})</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Rechercher par N° de commande ou Client UID..."
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
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-20 text-center">
          <FiBox size={64} className="mx-auto text-gray-200 mb-4" />
          <h3 className="text-xl font-bold text-gray-700">Aucune commande</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(cmd => (
            <div key={cmd._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Commande N°</p>
                  <p className="font-mono text-gray-900 font-black text-sm">{cmd._id.slice(-8).toUpperCase()}</p>
                </div>
                <div>{getStatusBadge(cmd.statut)}</div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-purple-600 font-bold mb-3 bg-purple-50 w-max px-2 py-1 rounded-md">
                <FiUser size={12} />
                Client: {cmd.client_uid}
              </div>

              <div className="mb-4 flex justify-between items-end">
                <div>
                  <p className="text-xl font-black text-gray-900">{formatPrice(cmd.montant_total)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-500">{formatDate(cmd.createdAt)}</p>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-50 flex gap-2">
                {cmd.statut === 'en_attente' && (
                  <button
                    onClick={() => handleUpdateStatus(cmd._id, 'livré')}
                    disabled={updatingId === cmd._id}
                    className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white py-2 rounded-lg font-bold transition-colors text-xs disabled:opacity-50"
                  >
                    <FiCheck size={14} /> Livrer
                  </button>
                )}
                {cmd.statut !== 'annulé' && (
                  <button
                    onClick={() => handleUpdateStatus(cmd._id, 'annulé')}
                    disabled={updatingId === cmd._id}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white py-2 rounded-lg font-bold transition-colors text-xs disabled:opacity-50"
                  >
                    <FiX size={14} /> Annuler
                  </button>
                )}
                <Link
                  to={`/commande/${cmd._id}`}
                  className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg font-bold transition-colors text-xs flex items-center justify-center"
                  title="Voir les détails"
                >
                  <FiBox size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
