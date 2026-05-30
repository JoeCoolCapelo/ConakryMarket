const Abonnement = require('../models/Abonnement');
const Client = require('../models/Client');
const Produit = require('../models/Produit');
const AppError = require('../utils/AppError');

// Tarifs en GNF
const TARIFS = {
  mensuel: 150000,  // 150 000 GNF/mois
  annuel: 1500000,  // 1 500 000 GNF/an
};

// Délai de grâce avant blocage (en jours)
const DELAI_ALERTE_JOURS = 5;

// ─── ADMIN: Créer/Enregistrer un paiement d'abonnement ───────────────────────
exports.enregistrerPaiement = async (req, res, next) => {
  try {
    const { vendeur_uid, type, note } = req.body;

    if (!['mensuel', 'annuel'].includes(type)) {
      return next(new AppError('Type invalide. Choisir mensuel ou annuel.', 400));
    }

    const vendeur = await Client.findOne({ uid: vendeur_uid, role: 'vendeur' });
    if (!vendeur) return next(new AppError('Vendeur introuvable', 404));

    const montant = TARIFS[type];
    const date_debut = new Date();
    const date_fin = new Date();
    if (type === 'mensuel') {
      date_fin.setMonth(date_fin.getMonth() + 1);
    } else {
      date_fin.setFullYear(date_fin.getFullYear() + 1);
    }

    const abonnement = await Abonnement.create({
      vendeur_uid,
      type,
      montant,
      statut: 'actif',
      date_debut,
      date_fin,
      date_paiement: new Date(),
      enregistre_par: req.user.uid,
      note,
    });

    // Réactiver les produits du vendeur s'ils étaient bloqués
    await Produit.updateMany({ vendeur_uid, actif: false }, { actif: true });

    // Mettre à jour statut abonnement sur le vendeur
    await Client.findOneAndUpdate({ uid: vendeur_uid }, { statut_abonnement: 'actif' });

    res.status(201).json({ message: 'Paiement enregistré avec succès', abonnement });
  } catch (error) {
    next(error);
  }
};

// ─── ADMIN: Liste tous les abonnements ───────────────────────────────────────
exports.getAllAbonnements = async (req, res, next) => {
  try {
    const { statut, type } = req.query;
    const filter = {};
    if (statut) filter.statut = statut;
    if (type) filter.type = type;

    const abonnements = await Abonnement.find(filter).sort({ createdAt: -1 });

    // Enrichir avec infos vendeur
    const vendeurUids = [...new Set(abonnements.map(a => a.vendeur_uid))];
    const vendeurs = await Client.find({ uid: { $in: vendeurUids } }).select('uid nom email telephone ville');
    const vendeurMap = {};
    vendeurs.forEach(v => { vendeurMap[v.uid] = v; });

    const enrichis = abonnements.map(a => ({
      ...a.toObject(),
      vendeur: vendeurMap[a.vendeur_uid] || null,
    }));

    res.json(enrichis);
  } catch (error) {
    next(error);
  }
};

// ─── ADMIN: Stats abonnements ─────────────────────────────────────────────────
exports.getStatsAbonnements = async (req, res, next) => {
  try {
    const maintenant = new Date();

    const [
      totalActifs, totalAlerte, totalBloques, totalExpires,
      revenuMensuel, revenuAnnuel, totalVendeurs
    ] = await Promise.all([
      Abonnement.countDocuments({ statut: 'actif' }),
      Abonnement.countDocuments({ statut: 'alerte' }),
      Abonnement.countDocuments({ statut: 'bloqué' }),
      Abonnement.countDocuments({ statut: 'expiré' }),
      Abonnement.aggregate([
        { $match: { type: 'mensuel', statut: { $in: ['actif', 'alerte'] } } },
        { $group: { _id: null, total: { $sum: '$montant' } } }
      ]),
      Abonnement.aggregate([
        { $match: { type: 'annuel', statut: { $in: ['actif', 'alerte'] } } },
        { $group: { _id: null, total: { $sum: '$montant' } } }
      ]),
      Client.countDocuments({ role: 'vendeur' }),
    ]);

    // Revenus du mois en cours
    const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
    const revenusMoisActuel = await Abonnement.aggregate([
      { $match: { date_paiement: { $gte: debutMois } } },
      { $group: { _id: null, total: { $sum: '$montant' } } }
    ]);

    res.json({
      totalActifs,
      totalAlerte,
      totalBloques,
      totalExpires,
      totalVendeurs,
      revenuMensuelActif: revenuMensuel[0]?.total || 0,
      revenuAnnuelActif: revenuAnnuel[0]?.total || 0,
      revenusMoisActuel: revenusMoisActuel[0]?.total || 0,
      tarifs: TARIFS,
    });
  } catch (error) {
    next(error);
  }
};

// ─── ADMIN: Liste vendeurs sans abonnement actif ──────────────────────────────
exports.getVendeursSansAbonnement = async (req, res, next) => {
  try {
    const abonnementsActifs = await Abonnement.find({
      statut: { $in: ['actif', 'alerte'] }
    }).distinct('vendeur_uid');

    const vendeursSans = await Client.find({
      role: 'vendeur',
      uid: { $nin: abonnementsActifs }
    }).select('uid nom email telephone ville date_inscription');

    res.json(vendeursSans);
  } catch (error) {
    next(error);
  }
};

// ─── ADMIN: Bloquer manuellement un vendeur ───────────────────────────────────
exports.bloquerVendeur = async (req, res, next) => {
  try {
    const { vendeur_uid } = req.params;
    await Produit.updateMany({ vendeur_uid }, { actif: false });
    await Abonnement.updateMany(
      { vendeur_uid, statut: { $in: ['actif', 'alerte', 'expiré'] } },
      { statut: 'bloqué' }
    );
    await Client.findOneAndUpdate({ uid: vendeur_uid }, { statut_abonnement: 'bloqué' });
    res.json({ message: 'Vendeur bloqué avec succès' });
  } catch (error) {
    next(error);
  }
};

// ─── CRON: Vérification automatique des abonnements ──────────────────────────
exports.verifierAbonnements = async () => {
  try {
    const maintenant = new Date();
    const seuilAlerte = new Date();
    seuilAlerte.setDate(seuilAlerte.getDate() + DELAI_ALERTE_JOURS);

    // 1. Passer en "alerte" ceux qui expirent dans moins de DELAI_ALERTE_JOURS jours
    const aAlerter = await Abonnement.find({
      statut: 'actif',
      date_fin: { $lte: seuilAlerte, $gt: maintenant }
    });
    for (const abo of aAlerter) {
      await Abonnement.findByIdAndUpdate(abo._id, { statut: 'alerte' });
      await Client.findOneAndUpdate({ uid: abo.vendeur_uid }, { statut_abonnement: 'alerte' });
      console.log(`[ABONNEMENT] Alerte envoyée au vendeur ${abo.vendeur_uid}`);
    }

    // 2. Bloquer ceux dont l'abonnement est expiré
    const aBlocker = await Abonnement.find({
      statut: { $in: ['actif', 'alerte'] },
      date_fin: { $lt: maintenant }
    });
    for (const abo of aBlocker) {
      await Abonnement.findByIdAndUpdate(abo._id, { statut: 'bloqué' });
      await Produit.updateMany({ vendeur_uid: abo.vendeur_uid }, { actif: false });
      await Client.findOneAndUpdate({ uid: abo.vendeur_uid }, { statut_abonnement: 'bloqué' });
      console.log(`[ABONNEMENT] Vendeur ${abo.vendeur_uid} bloqué (abonnement expiré)`);
    }

    console.log(`[CRON] Vérification terminée: ${aAlerter.length} alertes, ${aBlocker.length} blocages`);
  } catch (error) {
    console.error('[CRON] Erreur vérification abonnements:', error);
  }
};

// ─── VENDEUR: Voir son propre abonnement ──────────────────────────────────────
exports.getMonAbonnement = async (req, res, next) => {
  try {
    const abonnement = await Abonnement.findOne({
      vendeur_uid: req.user.uid,
      statut: { $in: ['actif', 'alerte'] }
    }).sort({ date_fin: -1 });

    const historique = await Abonnement.find({ vendeur_uid: req.user.uid })
      .sort({ createdAt: -1 }).limit(12);

    res.json({ abonnement, historique, tarifs: TARIFS });
  } catch (error) {
    next(error);
  }
};
