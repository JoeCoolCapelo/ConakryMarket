const Commande = require('../models/Commande');

exports.getCAParCategorie = async (vendeurId) => {
  const pipeline = [
    { $match: { statut: 'livré' } },
    { $unwind: '$articles' },
  ];
  if (vendeurId) {
    pipeline.push(
      { $lookup: { from: 'produits', localField: 'articles.pid', foreignField: 'pid', as: 'produit_info' } },
      { $unwind: '$produit_info' },
      { $match: { 'produit_info.vendeur_uid': vendeurId } }
    );
  }
  pipeline.push(
    { $group: { _id: '$articles.categorie', ca_total: { $sum: '$articles.sous_total' }, nb_ventes: { $sum: '$articles.quantite' } }},
    { $sort: { ca_total: -1 } }
  );
  return await Commande.aggregate(pipeline);
};

exports.getTopProduits = async (vendeurId) => {
  const pipeline = [
    { $match: { statut: 'livré' } },
    { $unwind: '$articles' },
  ];
  if (vendeurId) {
    pipeline.push(
      { $lookup: { from: 'produits', localField: 'articles.pid', foreignField: 'pid', as: 'produit_info' } },
      { $unwind: '$produit_info' },
      { $match: { 'produit_info.vendeur_uid': vendeurId } }
    );
  }
  pipeline.push(
    { $group: { _id: '$articles.nom', ca_produit: { $sum: '$articles.sous_total' }, nb_ventes: { $sum: '$articles.quantite' } }},
    { $sort: { ca_produit: -1 } },
    { $limit: 10 }
  );
  return await Commande.aggregate(pipeline);
};

exports.getCAParVille = async (vendeurId) => {
  const pipeline = [
    { $match: { statut: { $ne: 'annulé' } } },
    { $unwind: '$articles' },
  ];
  if (vendeurId) {
    pipeline.push(
      { $lookup: { from: 'produits', localField: 'articles.pid', foreignField: 'pid', as: 'produit_info' } },
      { $unwind: '$produit_info' },
      { $match: { 'produit_info.vendeur_uid': vendeurId } }
    );
  }
  pipeline.push(
    { $group: { _id: '$adresse_livraison.ville', ca_ville: { $sum: '$articles.sous_total' }, nb_commandes: { $sum: 1 } }},
    { $sort: { ca_ville: -1 } }
  );
  return await Commande.aggregate(pipeline);
};

exports.getEvolutionMensuelle = async (vendeurId) => {
  const pipeline = [
    { $match: { statut: 'livré' } },
    { $unwind: '$articles' },
  ];
  if (vendeurId) {
    pipeline.push(
      { $lookup: { from: 'produits', localField: 'articles.pid', foreignField: 'pid', as: 'produit_info' } },
      { $unwind: '$produit_info' },
      { $match: { 'produit_info.vendeur_uid': vendeurId } }
    );
  }
  pipeline.push(
    { $group: { _id: { annee: { $year: '$date_commande' }, mois: { $month: '$date_commande' } }, ca_mensuel: { $sum: '$articles.sous_total' }, nb_commandes: { $sum: 1 } }},
    { $sort: { '_id.annee': 1, '_id.mois': 1 } }
  );
  return await Commande.aggregate(pipeline);
};
