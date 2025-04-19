const express = require('express');
const authController = require('../services/auth.service');
const { protect } = require('../middlewares/JWTauth');
const { validateRegister, validateLogin, validateRefreshToken } = require('../validator/auth.validate');

const router = express.Router();

router.post('/sign-up', validateRegister, authController.register);
router.post('/sign-in', validateLogin, authController.login);
router.post('/sign-out', authController.logout);
router.post('/refresh-token', validateRefreshToken, authController.refreshToken);
router.get('/me', protect, authController.getMe);

module.exports = router;