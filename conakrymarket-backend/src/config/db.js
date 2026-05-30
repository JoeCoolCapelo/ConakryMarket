const mongoose = require('mongoose');

const createIndexes = async () => {
  try {
    await mongoose.connection.collection('produits').createIndex({ categorie: 1 });
    await mongoose.connection.collection('produits').createIndex({ prix: 1 });
    await mongoose.connection.collection('produits').createIndex({ categorie: 1, prix: 1 });
    await mongoose.connection.collection('produits').createIndex({ vendeur_uid: 1 });

    await mongoose.connection.collection('commandes').createIndex({ client_uid: 1 });
    await mongoose.connection.collection('commandes').createIndex({ date_commande: -1 });

    await mongoose.connection.collection('avis').createIndex({ pid: 1 });

    console.log('Database indexes created successfully');
  } catch (err) {
    console.warn('Warning: Could not create indexes:', err.message);
  }
};

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Create indexes after successful connection
    await createIndexes();

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('💡 Tips:');
    console.error('   1. Check your IP is whitelisted on MongoDB Atlas (Network Access)');
    console.error('   2. Verify your MONGODB_URI in .env');
    console.error('   3. Check your internet connection');
    process.exit(1);
  }
};

module.exports = connectDB;
