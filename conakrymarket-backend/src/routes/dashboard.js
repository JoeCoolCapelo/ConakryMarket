const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authJWT');

router.use(protect);

router.get('/ca-categories', dashboardController.getCACategories);
router.get('/top-vendeurs', dashboardController.getTopVendeurs);
router.get('/ca-villes', dashboardController.getCAVilles);
router.get('/evolution-mensuelle', dashboardController.getEvolutionMensuelle);
router.get('/stock-critique', dashboardController.getStockCritique);

module.exports = router;
