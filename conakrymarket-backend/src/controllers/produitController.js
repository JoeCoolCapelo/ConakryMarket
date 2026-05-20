const Produit = require('../models/Produit');
const { paginate } = require('../utils/pagination');

exports.getAll = async (req, res, next) => {
  try {
    const { categorie, prix_min, prix_max, ville, vendeur_uid, search, page = 1, limit = 10 } = req.query;
    const query = { actif: true };

    if (categorie) query.categorie = categorie;
    if (prix_min || prix_max) {
      query.prix = {};
      if (prix_min) query.prix.$gte = Number(prix_min);
      if (prix_max) query.prix.$lte = Number(prix_max);
    }
    if (ville) query.ville_vendeur = ville;
    if (vendeur_uid) query.vendeur_uid = vendeur_uid;
    if (search) query.nom = new RegExp(search, 'i');

    const result = await paginate(Produit, query, Number(page), Number(limit));
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const produit = await Produit.findOne({ pid: req.params.pid, actif: true });
    if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(produit);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    req.body.vendeur_uid = req.user.uid;
    req.body.pid = `P${Date.now()}`;
    const produit = await Produit.create(req.body);
    res.status(201).json(produit);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const isObjectId = req.params.pid.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: req.params.pid } : { pid: req.params.pid };
    const produit = await Produit.findOne(query);
    
    if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
    if (produit.vendeur_uid !== req.user.uid && req.user.role !== 'admin') return res.status(403).json({ message: 'Non autorisé' });

    const updated = await Produit.findOneAndUpdate(query, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const isObjectId = req.params.pid.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: req.params.pid } : { pid: req.params.pid };
    const produit = await Produit.findOne(query);
    if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
    if (produit.vendeur_uid !== req.user.uid && req.user.role !== 'admin') return res.status(403).json({ message: 'Non autorisé' });

    produit.actif = false;
    await produit.save();
    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    next(error);
  }
};

exports.uploadImages = async (req, res, next) => {
  try {
    const produit = await Produit.findOne({ pid: req.params.pid });
    if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
    if (produit.vendeur_uid !== req.user.uid && req.user.role !== 'admin') return res.status(403).json({ message: 'Non autorisé' });

    const urls = req.files.map(file => file.path);
    produit.images.push(...urls);
    await produit.save();
    res.json(produit);
  } catch (error) {
    next(error);
  }
};
