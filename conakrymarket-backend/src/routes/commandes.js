const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeController');
const { protect, authorize } = require('../middlewares/authJWT');

router.use(protect);

router.post('/', commandeController.create);
router.get('/mes-commandes', commandeController.getMesCommandes);
router.get('/vendeur', authorize('vendeur'), commandeController.getVendeurCommandes);
router.get('/:oid', commandeController.getOne);

router.patch('/:oid/statut', authorize('vendeur'), commandeController.updateStatut);

module.exports = router;
