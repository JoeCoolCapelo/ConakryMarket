const mongoose = require('mongoose');

const abonnementSchema = new mongoose.Schema({
  vendeur_uid: { type: String, required: true, ref: 'Client' },
  type: { 
    type: String, 
    enum: ['mensuel', 'annuel'], 
    required: true 
  },
  montant: { type: Number, required: true }, // en GNF
  statut: { 
    type: String, 
    enum: ['en_attente', 'actif', 'alerte', 'expiré', 'bloqué', 'refusé'], 
    default: 'en_attente' 
  },
  mode_paiement: { 
    type: String, 
    enum: ['Orange Money', 'Mobile Money', 'Espèces', 'Carte', 'Virement', 'Autre']
  },
  code_marchand: { type: String }, // Code marchand simulé (ex: 123456)
  numero_paiement: { type: String }, // Numéro de téléphone pour OM, ou autre réf
  preuve_paiement: { type: String }, // URL Cloudinary (optionnel si on veut garder la possibilité)
  date_debut: { type: Date },
  date_fin: { type: Date },
  date_paiement: { type: Date, default: Date.now },
  enregistre_par: { type: String }, // uid admin qui a validé
  note: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Abonnement', abonnementSchema);
