const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const clientSchema = new mongoose.Schema({
  uid: { type: String, unique: true, required: true },
  nom: { type: String, required: true },
  telephone: { type: String },
  email: { type: String, unique: true, required: true, lowercase: true },
  mot_de_passe: { type: String, required: true },
  ville: { type: String },
  age: { type: Number },
  photo_profil: { type: String },
  role: { 
    type: String, 
    enum: ['client', 'vendeur', 'admin'], 
    default: 'client' 
  },
  date_inscription: { type: Date, default: Date.now },
  nb_commandes_total: { type: Number, default: 0 },
  ca_total: { type: Number, default: 0 },
  statut_abonnement: { 
    type: String, 
    enum: ['actif', 'alerte', 'bloqué', 'aucun'], 
    default: 'aucun' 
  }
}, { timestamps: true });

clientSchema.pre('save', async function(next) {
  if (!this.isModified('mot_de_passe')) return next();
  const salt = await bcrypt.genSalt(10);
  this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, salt);
  next();
});

clientSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.mot_de_passe);
};

module.exports = mongoose.model('Client', clientSchema);
