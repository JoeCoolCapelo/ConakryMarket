const mongoose = require('mongoose');

const avisSchema = new mongoose.Schema({
  pid: { type: String, required: true },
  client_uid: { type: String, required: true },
  note: { type: Number, required: true, min: 1, max: 5 },
  commentaire: { type: String },
  date_avis: { type: Date, default: Date.now },
  utile: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Avis', avisSchema);
