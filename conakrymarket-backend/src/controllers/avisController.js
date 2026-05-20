const Avis = require('../models/Avis');
const Commande = require('../models/Commande');
const Produit = require('../models/Produit');

exports.create = async (req, res, next) => {
  try {
    const { pid, note, commentaire } = req.body;
    
    // Verified purchase check
    const aAchete = await Commande.findOne({ 
      client_uid: req.user.uid, 
      statut: 'livré',
      'articles.pid': pid 
    });
    
    if (!aAchete) {
      return res.status(403).json({ message: 'Vous devez acheter ce produit pour laisser un avis' });
    }

    const avis = await Avis.create({
      pid,
      client_uid: req.user.uid,
      note,
      commentaire
    });

    // Update product average rating
    const allAvis = await Avis.find({ pid });
    const avg = allAvis.reduce((acc, curr) => acc + curr.note, 0) / allAvis.length;
    await Produit.updateOne({ pid }, { note_moyenne: avg });

    res.status(201).json(avis);
  } catch (error) {
    next(error);
  }
};

exports.getByProduit = async (req, res, next) => {
  try {
    const avis = await Avis.find({ pid: req.params.pid }).sort({ date_avis: -1 });
    res.json(avis);
  } catch (error) {
    next(error);
  }
};

exports.incrementUtile = async (req, res, next) => {
  try {
    const avis = await Avis.findByIdAndUpdate(
      req.params.id,
      { $inc: { utile: 1 } },
      { new: true }
    );
    res.json(avis);
  } catch (error) {
    next(error);
  }
};
