const express = require('express');
const router = express.Router();
const avisController = require('../controllers/avisController');
const { protect } = require('../middlewares/authJWT');

router.get('/produit/:pid', avisController.getByProduit);
router.post('/', protect, avisController.create);
router.patch('/:id/utile', avisController.incrementUtile);

module.exports = router;
