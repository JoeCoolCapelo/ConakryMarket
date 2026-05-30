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
    enum: ['actif', 'alerte', 'expiré', 'bloqué'], 
    default: 'actif' 
  },
  date_debut: { type: Date, required: true },
  date_fin: { type: Date, required: true },
  date_paiement: { type: Date, default: Date.now },
  enregistre_par: { type: String }, // uid admin
  note: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Abonnement', abonnementSchema);
