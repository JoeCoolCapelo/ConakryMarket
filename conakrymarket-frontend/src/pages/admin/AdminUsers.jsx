import React, { useEffect, useState, useMemo } from 'react';
import { getAllUsers, deleteUser } from '../../services/admin';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';
import { FiTrash2, FiSearch, FiFilter, FiUser, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (uid, nom) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur ${nom} ?`)) {
      try {
        await deleteUser(uid);
        toast.success('Utilisateur supprimé');
        fetchUsers();
      } catch (error) {
        console.error(error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchRole = roleFilter ? u.role === roleFilter : true;
      const matchSearch = search 
        ? u.email.toLowerCase().includes(search.toLowerCase()) || 
          u.nom.toLowerCase().includes(search.toLowerCase()) ||
          u.uid.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchRole && matchSearch;
    });
  }, [users, search, roleFilter]);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-accent-dark">Gestion des Utilisateurs</h1>
        <p className="text-gray-500 mt-1">{filtered.length} utilisateur(s) trouvé(s) sur la plateforme</p>
      </div>

      {/* Barre de filtres */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Rechercher par nom, email ou UID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />
        </div>
        <div className="relative">
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          <select 
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="w-full sm:w-auto pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none bg-white cursor-pointer"
          >
            <option value="">Tous les rôles</option>
            <option value="client">Clients uniquement</option>
            <option value="vendeur">Vendeurs uniquement</option>
            <option value="admin">Administrateurs</option>
          </select>
        </div>
        {(search || roleFilter) && (
          <button
            onClick={() => { setSearch(''); setRoleFilter(''); }}
            className="px-4 py-2.5 text-sm text-gray-500 hover:text-purple-600 border border-gray-200 rounded-xl hover:border-purple-600/30 transition-all font-medium"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Grille de cartes utilisateurs */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-20 text-center">
          <FiUser size={64} className="mx-auto text-gray-200 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">Aucun utilisateur trouvé</h3>
          <p className="text-gray-500">Essayez de modifier vos filtres de recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(user => (
            <div key={user.uid} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              {/* Ligne de décoration supérieure */}
              <div className={`absolute top-0 left-0 w-full h-1.5 opacity-80 ${
                user.role === 'admin' ? 'bg-purple-500' :
                user.role === 'vendeur' ? 'bg-orange-500' :
                'bg-blue-500'
              }`}></div>

              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                  user.role === 'vendeur' ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {user.photo_profil ? (
                    <img src={user.photo_profil} alt={user.nom} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    user.nom.charAt(0).toUpperCase()
                  )}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-black ${
                  user.role === 'admin' ? 'bg-purple-50 text-purple-600 border border-purple-200' :
                  user.role === 'vendeur' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                  'bg-blue-50 text-blue-600 border border-blue-200'
                }`}>
                  {user.role}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-lg truncate" title={user.nom}>{user.nom}</h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {user.uid}</p>
              </div>

              <div className="mt-5 space-y-2 flex-grow">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiMail className="text-gray-400 shrink-0" size={14} />
                  <span className="truncate" title={user.email}>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiPhone className="text-gray-400 shrink-0" size={14} />
                  <span>{user.telephone || 'Non renseigné'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiCalendar className="text-gray-400 shrink-0" size={14} />
                  <span>Inscrit le {formatDate(user.date_inscription)}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-50">
                <button 
                  onClick={() => handleDelete(user.uid, user.nom)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    user.role === 'admin' 
                      ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                      : 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white'
                  }`}
                  disabled={user.role === 'admin'}
                  title={user.role === 'admin' ? "Impossible de supprimer un administrateur" : "Supprimer l'utilisateur"}
                >
                  <FiTrash2 size={16} /> 
                  {user.role === 'admin' ? 'Intouchable' : 'Supprimer'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
