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
router.put('/debloquer/:vendeur_uid', authorize('admin'), ctrl.debloquerVendeur);
router.put('/:id/valider', authorize('admin'), ctrl.validerAbonnement);
router.put('/:id/refuser', authorize('admin'), ctrl.refuserAbonnement);

// Routes Vendeur
router.get('/mon-abonnement', authorize('vendeur'), ctrl.getMonAbonnement);
router.post('/payer', authorize('vendeur'), ctrl.demanderAbonnement);

module.exports = router;
