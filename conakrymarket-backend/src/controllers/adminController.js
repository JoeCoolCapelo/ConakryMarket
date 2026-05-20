const Client = require('../models/Client');
const Commande = require('../models/Commande');
const Produit = require('../models/Produit');
const AppError = require('../utils/AppError');
const { getCAParCategorie, getTopProduits, getCAParVille, getEvolutionMensuelle } = require('../services/aggregations');

exports.getGlobalStats = async (req, res, next) => {
  try {
    const [
      totalUsers, totalCommandes, totalProduits,
      totalClients, totalVendeurs,
      commandesLivrees, commandesEnAttente, commandesAnnulees,
      caGlobalResult, stockCritique, dernierInscrit
    ] = await Promise.all([
      Client.countDocuments(),
      Commande.countDocuments(),
      Produit.countDocuments({ actif: { $ne: false } }),
      Client.countDocuments({ role: 'client' }),
      Client.countDocuments({ role: 'vendeur' }),
      Commande.countDocuments({ statut: 'livré' }),
      Commande.countDocuments({ statut: 'en_attente' }),
      Commande.countDocuments({ statut: 'annulé' }),
      Commande.aggregate([
        { $match: { statut: { $ne: 'annulé' } } },
        { $group: { _id: null, total: { $sum: '$montant_total' } } }
      ]),
      Produit.countDocuments({ stock: { $lt: 10 }, actif: { $ne: false } }),
      Client.find().sort({ date_inscription: -1 }).limit(5).select('nom email role date_inscription')
    ]);

    const caGlobal = caGlobalResult.length > 0 ? caGlobalResult[0].total : 0;

    res.json({
      totalUsers,
      totalCommandes,
      totalProduits,
      totalClients,
      totalVendeurs,
      commandesLivrees,
      commandesEnAttente,
      commandesAnnulees,
      caGlobal,
      stockCritique,
      dernierInscrit
    });
  } catch (error) {
    next(error);
  }
};

// Pipelines globaux (sans filtre vendeur)
exports.getAdminCACategories = async (req, res, next) => {
  try {
    const data = await getCAParCategorie(null);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getAdminTopProduits = async (req, res, next) => {
  try {
    const data = await getTopProduits(null);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getAdminCAVilles = async (req, res, next) => {
  try {
    const data = await getCAParVille(null);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getAdminEvolutionMensuelle = async (req, res, next) => {
  try {
    const data = await getEvolutionMensuelle(null);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getAdminStockCritique = async (req, res, next) => {
  try {
    const produits = await Produit.find({ stock: { $lt: 10 }, actif: { $ne: false } })
      .sort({ stock: 1 })
      .limit(20)
      .select('pid nom categorie stock vendeur_uid prix images');
    res.json(produits);
  } catch (error) {
    next(error);
  }
};

exports.getTopVendeurs = async (req, res, next) => {
  try {
    const data = await Commande.aggregate([
      { $match: { statut: 'livré' } },
      { $unwind: '$articles' },
      { $lookup: { from: 'produits', localField: 'articles.pid', foreignField: 'pid', as: 'produit_info' } },
      { $unwind: '$produit_info' },
      { $group: { _id: '$produit_info.vendeur_uid', ca_vendeur: { $sum: '$articles.sous_total' }, nb_ventes: { $sum: 1 } } },
      { $sort: { ca_vendeur: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'clients', localField: '_id', foreignField: 'uid', as: 'vendeur_info' } },
      { $unwind: { path: '$vendeur_info', preserveNullAndEmptyArrays: true } },
      { $project: { _id: 1, ca_vendeur: 1, nb_ventes: 1, nom: '$vendeur_info.nom', email: '$vendeur_info.email' } }
    ]);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await Client.find().select('-mot_de_passe').sort({ date_inscription: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await Client.findOneAndDelete({ uid: req.params.uid });
    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }
    
    // Si c'est un vendeur, on supprime aussi ses produits
    if (user.role === 'vendeur') {
      await Produit.deleteMany({ vendeur_uid: user.uid });
    }

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};

exports.getAllCommandes = async (req, res, next) => {
  try {
    const commandes = await Commande.find().sort({ date_commande: -1 }).limit(200);
    res.json(commandes);
  } catch (error) {
    next(error);
  }
};
