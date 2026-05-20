const aggregations = require('../services/aggregations');
const Produit = require('../models/Produit');

exports.getCACategories = async (req, res, next) => {
  try {
    const data = await aggregations.getCAParCategorie(req.user.uid);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getTopVendeurs = async (req, res, next) => {
  try {
    // Top Vendeurs becomes Top Produits for the vendor
    const data = await aggregations.getTopProduits(req.user.uid);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getCAVilles = async (req, res, next) => {
  try {
    const data = await aggregations.getCAParVille(req.user.uid);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getEvolutionMensuelle = async (req, res, next) => {
  try {
    const data = await aggregations.getEvolutionMensuelle(req.user.uid);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getStockCritique = async (req, res, next) => {
  try {
    const { seuil = 10 } = req.query;
    const query = { stock: { $lt: Number(seuil) }, actif: { $ne: false } };
    
    // Si l'utilisateur est un vendeur, on ne renvoie que ses produits
    if (req.user && req.user.role === 'vendeur') {
      query.vendeur_uid = req.user.uid;
    }

    const produits = await Produit.find(query);
    res.json(produits);
  } catch (error) {
    next(error);
  }
};
