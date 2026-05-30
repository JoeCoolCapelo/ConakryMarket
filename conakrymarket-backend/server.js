require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middlewares/errorHandler');

const authRoutes = require('./src/routes/auth');
const produitRoutes = require('./src/routes/produits');
const commandeRoutes = require('./src/routes/commandes');
const avisRoutes = require('./src/routes/avis');
const dashboardRoutes = require('./src/routes/dashboard');
const adminRoutes = require('./src/routes/admin');
const abonnementRoutes = require('./src/routes/abonnements');
const { verifierAbonnements } = require('./src/controllers/abonnementController');
const cron = require('node-cron');

// Models pour stats publiques
const Client = require('./src/models/Client');
const Commande = require('./src/models/Commande');
const Produit = require('./src/models/Produit');

const app = express();

const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/produits', produitRoutes);
app.use('/api/commandes', commandeRoutes);
app.use('/api/avis', avisRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/abonnements', abonnementRoutes);

// ─── CRON: Vérification abonnements toutes les heures ───────────────────────────
verifierAbonnements(); // Au démarrage
cron.schedule('0 * * * *', () => {
  console.log('[CRON] Vérification des abonnements...');
  verifierAbonnements();
});

// Route publique pour les statistiques de la home page
app.get('/api/stats', async (req, res) => {
  try {
    const [totalUsers, totalProduits, totalCommandes, totalVendeurs] = await Promise.all([
      Client.countDocuments({ role: 'client' }),
      Produit.countDocuments({ actif: { $ne: false } }),
      Commande.countDocuments({ statut: 'livr\u00e9' }),
      Client.countDocuments({ role: 'vendeur' }),
    ]);
    res.json({ totalUsers, totalProduits, totalCommandes, totalVendeurs });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
