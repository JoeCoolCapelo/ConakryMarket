require('dotenv').config();
const mongoose = require('mongoose');
const Client = require('../src/models/Client');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/conakrymarket';

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connecté à MongoDB.');

    const adminEmail = 'admin@conakrymarket.com';
    const existingAdmin = await Client.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Le compte administrateur existe déjà :', adminEmail);
      process.exit(0);
    }

    const admin = await Client.create({
      uid: `A${Date.now()}`,
      nom: 'Super Administrateur',
      email: adminEmail,
      mot_de_passe: 'admin123',
      role: 'admin',
      ville: 'Conakry'
    });

    console.log('Compte administrateur créé avec succès !');
    console.log('Email:', admin.email);
    console.log('Mot de passe:', 'admin123');

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
    process.exit(1);
  }
};

createAdmin();
