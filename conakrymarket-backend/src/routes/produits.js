const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');
const { protect, authorize } = require('../middlewares/authJWT');
const checkAbonnement = require('../middlewares/checkAbonnement');
const upload = require('../middlewares/upload');

router.get('/', produitController.getAll);
router.get('/:pid', produitController.getOne);

router.post('/', protect, authorize('vendeur'), checkAbonnement, produitController.create);
router.put('/:pid', protect, authorize('vendeur'), checkAbonnement, produitController.update);
router.delete('/:pid', protect, authorize('vendeur'), checkAbonnement, produitController.remove);
router.post('/:pid/images', protect, authorize('vendeur'), checkAbonnement, upload.array('images', 5), produitController.uploadImages);

module.exports = router;
