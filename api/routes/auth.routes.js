const express = require('express');
const authController = require('../services/auth.service');
const { protect } = require('../middlewares/JWTauth');

const router = express.Router();

router.post('/sign-up', authController.register);
router.post('/sign-in', authController.login);
router.post('/sign-out', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.get('/me', protect, authController.getMe);

module.exports = router;