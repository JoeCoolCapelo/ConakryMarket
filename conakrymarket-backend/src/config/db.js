const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    const db = mongoose.connection.collection;
    await mongoose.connection.collection('produits').createIndex({ categorie: 1 });
    await mongoose.connection.collection('produits').createIndex({ prix: 1 });
    await mongoose.connection.collection('produits').createIndex({ categorie: 1, prix: 1 });
    await mongoose.connection.collection('produits').createIndex({ vendeur_uid: 1 });
    
    await mongoose.connection.collection('commandes').createIndex({ client_uid: 1 });
    await mongoose.connection.collection('commandes').createIndex({ date_commande: -1 });
    
    await mongoose.connection.collection('avis').createIndex({ pid: 1 });
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
