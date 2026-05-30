const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/abonnementController');
const { protect, authorize } = require('../middlewares/authJWT');

router.use(protect);

// Routes Admin
router.get('/stats', authorize('admin'), ctrl.getStatsAbonnements);
router.get('/', authorize('admin'), ctrl.getAllAbonnements);
router.post('/paiement', authorize('admin'), ctrl.enregistrerPaiement);
router.get('/sans-abonnement', authorize('admin'), ctrl.getVendeursSansAbonnement);
router.put('/bloquer/:vendeur_uid', authorize('admin'), ctrl.bloquerVendeur);

// Route Vendeur
router.get('/mon-abonnement', authorize('vendeur'), ctrl.getMonAbonnement);

module.exports = router;
