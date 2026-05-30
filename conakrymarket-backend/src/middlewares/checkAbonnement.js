const Client = require('../models/Client');
const Abonnement = require('../models/Abonnement');

/**
 * Middleware qui vérifie si un vendeur a un abonnement actif.
 * Bloque les actions vendeur (créer/modifier/supprimer produits) si le compte est bloqué
 * ou si l'abonnement est expiré.
 * 
 * À utiliser APRÈS les middlewares protect + authorize('vendeur')
 */
const checkAbonnement = async (req, res, next) => {
  try {
    // Ne vérifier que pour les vendeurs
    if (!req.user || req.user.role !== 'vendeur') {
      return next();
    }

    // Vérifier si le compte est bloqué
    const vendeur = await Client.findOne({ uid: req.user.uid });
    
    if (!vendeur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (vendeur.compte_bloque) {
      return res.status(403).json({ 
        message: 'Votre compte est bloqué. Veuillez renouveler votre abonnement pour continuer à vendre.',
        code: 'COMPTE_BLOQUE',
        statut_abonnement: vendeur.statut_abonnement
      });
    }

    // Vérifier s'il a un abonnement actif ou en alerte
    const abonnement = await Abonnement.findOne({
      vendeur_uid: req.user.uid,
      statut: { $in: ['actif', 'alerte'] }
    }).sort({ date_fin: -1 });

    if (!abonnement) {
      return res.status(403).json({ 
        message: 'Vous devez souscrire un abonnement pour publier des produits.',
        code: 'PAS_ABONNEMENT',
        tarifs: { mensuel: 50000, annuel: 500000 }
      });
    }

    // Si en alerte, ajouter un warning dans la réponse
    if (abonnement.statut === 'alerte') {
      const joursRestants = Math.ceil((abonnement.date_fin - new Date()) / (1000 * 60 * 60 * 24));
      req.abonnementWarning = {
        message: `Votre abonnement expire dans ${joursRestants} jour(s). Pensez à le renouveler !`,
        date_fin: abonnement.date_fin,
        jours_restants: joursRestants
      };
    }

    // Attacher l'abonnement à la requête
    req.abonnement = abonnement;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkAbonnement;
