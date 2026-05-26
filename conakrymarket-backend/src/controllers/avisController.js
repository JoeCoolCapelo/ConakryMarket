const Avis = require('../models/Avis');
const Commande = require('../models/Commande');
const Produit = require('../models/Produit');

exports.create = async (req, res, next) => {
  try {
    const { pid, note, commentaire } = req.body;
    
    // Resolve product - pid might be MongoDB _id or textual pid
    const isObjectId = pid.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: pid } : { pid: pid };
    const produit = await Produit.findOne(query);
    
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    const realPid = produit.pid;

    const avis = await Avis.create({
      pid: realPid,
      client_uid: req.user.uid,
      note,
      commentaire
    });

    // Update product average rating and review count
    const allAvis = await Avis.find({ pid: realPid });
    const avg = allAvis.reduce((acc, curr) => acc + curr.note, 0) / allAvis.length;
    await Produit.updateOne({ pid: realPid }, { note_moyenne: avg, nombre_avis: allAvis.length });

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
