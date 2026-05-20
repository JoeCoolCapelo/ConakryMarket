const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  pid: { type: String, unique: true, required: true },
  nom: { type: String, required: true },
  vendeur_uid: { type: String, required: true },
  categorie: { 
    type: String, 
    enum: ['Électronique', 'Vêtements', 'Alimentation', 'Équipement agricole'], 
    required: true 
  },
  prix: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  ville_vendeur: { type: String },
  images: [{ type: String }],
  description: { type: String },
  note_moyenne: { type: Number, default: 0 },
  marque: { type: String },
  modele: { type: String },
  processeur: { type: String },
  ram_go: { type: Number },
  stockage_go: { type: Number },
  taille: [{ type: String }],
  couleurs: [{ type: String }],
  matiere: { type: String },
  poids_kg: { type: Number },
  unite: { type: String },
  peremption: { type: Date },
  puissance_w: { type: Number },
  garantie_mois: { type: Number },
  actif: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Produit', produitSchema);
