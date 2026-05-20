const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authJWT');

// Protéger toutes les routes admin
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', adminController.getGlobalStats);
router.get('/users', adminController.getAllUsers);
router.delete('/users/:uid', adminController.deleteUser);
router.get('/commandes', adminController.getAllCommandes);

// Charts & Graphiques
router.get('/ca-categories', adminController.getAdminCACategories);
router.get('/top-produits', adminController.getAdminTopProduits);
router.get('/ca-villes', adminController.getAdminCAVilles);
router.get('/evolution-mensuelle', adminController.getAdminEvolutionMensuelle);
router.get('/stock-critique', adminController.getAdminStockCritique);
router.get('/top-vendeurs', adminController.getTopVendeurs);

module.exports = router;
