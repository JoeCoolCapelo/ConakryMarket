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

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
