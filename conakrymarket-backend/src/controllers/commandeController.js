const Commande = require('../models/Commande');
const Produit = require('../models/Produit');
const { calculerMontantTotal } = require('../utils/calculs');

exports.create = async (req, res, next) => {
  try {
    const { articles, mode_paiement, adresse_livraison } = req.body;
    let montant_total = 0;
    
    for (let item of articles) {
      const produit = await Produit.findOne({ pid: item.pid });
      if (!produit || produit.stock < item.quantite) {
        return res.status(400).json({ message: `Stock insuffisant pour ${produit ? produit.nom : item.pid}` });
      }
      item.prix_unit = produit.prix;
      item.sous_total = produit.prix * item.quantite;
      item.nom = produit.nom;
      item.categorie = produit.categorie;
      
      await Produit.updateOne({ pid: item.pid }, { $inc: { stock: -item.quantite } });
    }
    
    montant_total = calculerMontantTotal(articles);

    const commande = await Commande.create({
      oid: `O${Date.now()}`,
      client_uid: req.user.uid,
      articles,
      montant_total,
      mode_paiement,
      adresse_livraison
    });

    res.status(201).json(commande);
  } catch (error) {
    next(error);
  }
};

exports.getMesCommandes = async (req, res, next) => {
  try {
    const commandes = await Commande.find({ client_uid: req.user.uid }).sort({ date_commande: -1 });
    res.json(commandes);
  } catch (error) {
    next(error);
  }
};

exports.getVendeurCommandes = async (req, res, next) => {
  try {
    // 1. Trouver tous les produits du vendeur
    const mesProduits = await Produit.find({ vendeur_uid: req.user.uid }).select('pid');
    const mesPids = mesProduits.map(p => p.pid);

    // 2. Trouver toutes les commandes qui contiennent au moins un de ces produits
    const commandes = await Commande.find({ 'articles.pid': { $in: mesPids } }).sort({ date_commande: -1 });
    
    // Optionnel : on pourrait filtrer les 'articles' pour ne renvoyer que ceux du vendeur, 
    // mais pour l'affichage de l'ordre complet, on laisse tel quel.
    res.json(commandes);
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    let commande = await Commande.findOne({ oid: req.params.oid }).lean();
    if (!commande) {
      // Fallback: try finding by _id if oid is actually an _id
      if (req.params.oid.match(/^[0-9a-fA-F]{24}$/)) {
        commande = await Commande.findById(req.params.oid).lean();
      }
    }
    
    if (!commande) return res.status(404).json({ message: 'Commande non trouvée' });
    
    // Vérification de sécurité (Isolation)
    let isAuthorized = false;
    
    // Le client propriétaire a toujours le droit
    if (commande.client_uid === req.user.uid) {
      isAuthorized = true;
    } 
    // Si c'est un vendeur, on vérifie que la commande contient au moins un de ses produits
    else if (req.user.role === 'vendeur') {
      const mesProduits = await Produit.find({ vendeur_uid: req.user.uid }).select('pid');
      const mesPids = mesProduits.map(p => p.pid);
      
      const containsMyProduct = commande.articles.some(article => mesPids.includes(article.pid));
      if (containsMyProduct) {
        isAuthorized = true;
      }
    }
    // Si c'est un admin, accès total
    else if (req.user.role === 'admin') {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Accès non autorisé à cette commande' });
    }
    
    // Attach photos to articles
    if (commande.articles && commande.articles.length > 0) {
      const articlesWithPhotos = await Promise.all(commande.articles.map(async (article) => {
        const produit = await Produit.findOne({ pid: article.pid }).lean();
        return {
          ...article,
          image: (produit && produit.images && produit.images.length > 0) ? produit.images[0] : null
        };
      }));
      commande.articles = articlesWithPhotos;
    }

    res.json(commande);
  } catch (error) {
    next(error);
  }
};

exports.updateStatut = async (req, res, next) => {
  try {
    const isObjectId = req.params.oid.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: req.params.oid } : { oid: req.params.oid };
    
    // Vérification de sécurité
    if (req.user.role !== 'admin') {
      const mesProduits = await Produit.find({ vendeur_uid: req.user.uid }).select('pid');
      const mesPids = mesProduits.map(p => p.pid);
      query['articles.pid'] = { $in: mesPids };
    }

    const commande = await Commande.findOneAndUpdate(
      query,
      { statut: req.body.statut },
      { new: true }
    );
    
    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée ou non autorisée' });
    }
    
    res.json(commande);
  } catch (error) {
    next(error);
  }
};
