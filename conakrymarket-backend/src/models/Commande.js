const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
  oid: { type: String, unique: true, required: true },
  client_uid: { type: String, required: true },
  date_commande: { type: Date, default: Date.now },
  statut: { 
    type: String, 
    enum: ['en_attente', 'livré', 'annulé'], 
    default: 'en_attente' 
  },
  articles: [{
    pid: { type: String },
    nom: { type: String },
    categorie: { type: String },
    quantite: { type: Number },
    prix_unit: { type: Number },
    sous_total: { type: Number }
  }],
  montant_total: { type: Number, required: true },
  mode_paiement: { 
    type: String, 
    enum: ['Mobile Money', 'Espèces', 'Carte'] 
  },
  adresse_livraison: {
    ville: { type: String },
    quartier: { type: String },
    details: { type: String }
  },
  date_livraison: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Commande', commandeSchema);
