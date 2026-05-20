const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authJWT');
const uploadProfile = require('../middlewares/uploadProfile');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);
router.put('/update', protect, uploadProfile.single('photo_profil'), authController.updateProfile);

module.exports = router;
