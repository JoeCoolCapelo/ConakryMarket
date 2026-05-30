import React, { useEffect, useState, useMemo } from 'react';
import {
  getStatsAbonnements, getAllAbonnements,
  enregistrerPaiement, getVendeursSansAbonnement, bloquerVendeur
} from '../../services/admin';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';
import {
  FiCreditCard, FiUsers, FiAlertTriangle, FiCheckCircle,
  FiXCircle, FiSearch, FiFilter, FiPlus, FiLock, FiClock,
  FiDollarSign, FiCalendar, FiRefreshCw
} from 'react-icons/fi';

const formatGNF = (n) => new Intl.NumberFormat('fr-GN', { style: 'currency', currency: 'GNF', maximumFractionDigits: 0 }).format(n);

const STATUT_CONFIG = {
  actif:   { label: 'Actif',   color: 'bg-green-100 text-green-700',  icon: <FiCheckCircle size={13}/> },
  alerte:  { label: 'Alerte',  color: 'bg-yellow-100 text-yellow-700', icon: <FiAlertTriangle size={13}/> },
  bloqué:  { label: 'Bloqué',  color: 'bg-red-100 text-red-700',    icon: <FiXCircle size={13}/> },
  expiré:  { label: 'Expiré',  color: 'bg-gray-100 text-gray-600',  icon: <FiClock size={13}/> },
};

// ─── Modal Enregistrer Paiement ───────────────────────────────────────────────
const ModalPaiement = ({ onClose, onSuccess, tarifs, vendeurPreselect }) => {
  const [vendeurs, setVendeurs] = useState([]);
  const [form, setForm] = useState({
    vendeur_uid: vendeurPreselect?.uid || '',
    type: 'mensuel',
    note: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getVendeursSansAbonnement().then(setVendeurs).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!form.vendeur_uid) return toast.error('Choisissez un vendeur');
    setLoading(true);
    try {
      await enregistrerPaiement(form);
      toast.success('Paiement enregistré ! Vendeur activé.');
      onSuccess();
      onClose();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const montant = tarifs?.[form.type] || 0;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FiCreditCard className="text-orange-500"/> Enregistrer un paiement
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {/* Vendeur */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Vendeur</label>
            {vendeurPreselect ? (
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-sm font-medium text-gray-800">
                {vendeurPreselect.nom} — {vendeurPreselect.email}
              </div>
            ) : (
              <select
                value={form.vendeur_uid}
                onChange={e => setForm({ ...form, vendeur_uid: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400"
              >
                <option value="">-- Choisir un vendeur --</option>
                {vendeurs.map(v => (
                  <option key={v.uid} value={v.uid}>{v.nom} — {v.email}</option>
                ))}
              </select>
            )}
          </div>

          {/* Type abonnement */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Type d'abonnement</label>
            <div className="grid grid-cols-2 gap-3">
              {['mensuel', 'annuel'].map(t => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, type: t })}
                  className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                    form.type === t
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="capitalize">{t}</div>
                  <div className="text-xs font-normal mt-0.5">{formatGNF(tarifs?.[t] || 0)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Récap montant */}
          <div className="bg-gradient-to-r from-orange-500 to-green-600 rounded-xl p-4 text-white">
            <div className="text-xs opacity-80 uppercase tracking-wide mb-1">Montant à encaisser</div>
            <div className="text-2xl font-black">{formatGNF(montant)}</div>
            <div className="text-xs opacity-80 mt-1">
              Valide {form.type === 'mensuel' ? '1 mois' : '12 mois'} à partir d'aujourd'hui
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Note (optionnel)</label>
            <input
              type="text"
              placeholder="Ex: Paiement en cash, reçu n°..."
              value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-orange-700 disabled:opacity-60 transition-all"
          >
            {loading ? 'Enregistrement...' : 'Confirmer le paiement'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Page principale ──────────────────────────────────────────────────────────
const AdminAbonnements = () => {
  const [stats, setStats] = useState(null);
  const [abonnements, setAbonnements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onglet, setOnglet] = useState('tous');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [vendeurPreselect, setVendeurPreselect] = useState(null);
  const [vendeursSans, setVendeursSans] = useState([]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [s, a, vs] = await Promise.all([
        getStatsAbonnements(),
        getAllAbonnements(),
        getVendeursSansAbonnement(),
      ]);
      setStats(s);
      setAbonnements(a);
      setVendeursSans(vs);
    } catch (e) {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleBloquer = async (vendeur_uid, nom) => {
    if (!window.confirm(`Bloquer définitivement ${nom} ?`)) return;
    try {
      await bloquerVendeur(vendeur_uid);
      toast.success('Vendeur bloqué');
      fetchAll();
    } catch {
      toast.error('Erreur');
    }
  };

  const openModalFor = (vendeur = null) => {
    setVendeurPreselect(vendeur);
    setShowModal(true);
  };

  const filtred = useMemo(() => {
    let list = abonnements;
    if (onglet !== 'tous') list = list.filter(a => a.statut === onglet);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(a =>
        a.vendeur?.nom?.toLowerCase().includes(s) ||
        a.vendeur?.email?.toLowerCase().includes(s)
      );
    }
    return list;
  }, [abonnements, onglet, search]);

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"/>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Abonnements Vendeurs</h1>
          <p className="text-gray-500 mt-1">Gérez les paiements et l'accès des vendeurs</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchAll} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-white transition-all">
            <FiRefreshCw size={15}/> Actualiser
          </button>
          <button onClick={() => openModalFor(null)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-orange-700 shadow-md shadow-orange-200 transition-all">
            <FiPlus size={15}/> Enregistrer un paiement
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Abonnés actifs', value: stats.totalActifs, icon: <FiCheckCircle/>, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'En alerte', value: stats.totalAlerte, icon: <FiAlertTriangle/>, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Bloqués', value: stats.totalBloques, icon: <FiLock/>, color: 'text-red-500', bg: 'bg-red-50' },
            { label: 'Non abonnés', value: vendeursSans.length, icon: <FiUsers/>, color: 'text-gray-500', bg: 'bg-gray-100' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center ${s.color} mb-3`}>
                {s.icon}
              </div>
              <div className="text-2xl font-black text-gray-800">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Revenus du mois */}
      {stats && (
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-green-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            <div>
              <div className="text-sm opacity-80 uppercase tracking-wider mb-1 flex items-center gap-1.5"><FiDollarSign size={14}/> Revenus encaissés ce mois</div>
              <div className="text-4xl font-black">{formatGNF(stats.revenusMoisActuel)}</div>
            </div>
            <div className="flex gap-8">
              <div>
                <div className="text-xs opacity-70 mb-1">Tarif mensuel</div>
                <div className="text-xl font-bold">{formatGNF(stats.tarifs?.mensuel || 0)}</div>
              </div>
              <div>
                <div className="text-xs opacity-70 mb-1">Tarif annuel</div>
                <div className="text-xl font-bold">{formatGNF(stats.tarifs?.annuel || 0)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vendeurs sans abonnement */}
      {vendeursSans.length > 0 && (
        <div className="bg-white rounded-2xl border border-yellow-200 shadow-sm p-5 mb-8">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
            <FiAlertTriangle className="text-yellow-500"/> {vendeursSans.length} vendeur(s) sans abonnement actif
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {vendeursSans.map(v => (
              <div key={v.uid} className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                <div>
                  <div className="font-semibold text-sm text-gray-800">{v.nom}</div>
                  <div className="text-xs text-gray-500">{v.email} · {v.ville}</div>
                </div>
                <button
                  onClick={() => openModalFor(v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition-all"
                >
                  <FiPlus size={12}/> Abonner
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tableau abonnements */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Onglets */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {[
              { key: 'tous', label: 'Tous' },
              { key: 'actif', label: 'Actifs' },
              { key: 'alerte', label: 'Alertes' },
              { key: 'bloqué', label: 'Bloqués' },
            ].map(o => (
              <button
                key={o.key}
                onClick={() => setOnglet(o.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  onglet === o.key ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
            <input
              type="text"
              placeholder="Rechercher un vendeur..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400"
            />
          </div>
        </div>

        {filtred.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">Aucun abonnement trouvé</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-5 py-3.5 font-semibold">Vendeur</th>
                  <th className="px-5 py-3.5 font-semibold">Type</th>
                  <th className="px-5 py-3.5 font-semibold">Montant</th>
                  <th className="px-5 py-3.5 font-semibold">Statut</th>
                  <th className="px-5 py-3.5 font-semibold">Date paiement</th>
                  <th className="px-5 py-3.5 font-semibold">Expiration</th>
                  <th className="px-5 py-3.5 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtred.map(a => {
                  const s = STATUT_CONFIG[a.statut] || STATUT_CONFIG['expiré'];
                  const joursRestants = Math.ceil((new Date(a.date_fin) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={a._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-sm text-gray-800">{a.vendeur?.nom || '—'}</div>
                        <div className="text-xs text-gray-400">{a.vendeur?.email}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${a.type === 'annuel' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {a.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-sm text-gray-700">{formatGNF(a.montant)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${s.color}`}>
                          {s.icon} {s.label}
                        </span>
                        {a.statut === 'alerte' && joursRestants > 0 && (
                          <div className="text-xs text-yellow-600 mt-0.5">expire dans {joursRestants}j</div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">{formatDate(a.date_paiement)}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{formatDate(a.date_fin)}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModalFor(a.vendeur)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-orange-50 text-orange-600 text-xs font-semibold rounded-lg hover:bg-orange-100 transition-all"
                          >
                            <FiRefreshCw size={11}/> Renouveler
                          </button>
                          {a.statut !== 'bloqué' && (
                            <button
                              onClick={() => handleBloquer(a.vendeur_uid, a.vendeur?.nom)}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-all"
                            >
                              <FiLock size={11}/> Bloquer
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <ModalPaiement
          onClose={() => { setShowModal(false); setVendeurPreselect(null); }}
          onSuccess={fetchAll}
          tarifs={stats?.tarifs}
          vendeurPreselect={vendeurPreselect}
        />
      )}
    </div>
  );
};

export default AdminAbonnements;
