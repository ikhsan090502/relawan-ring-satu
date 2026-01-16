const express = require('express');
const { authenticateToken } = require('../middleware/verifyToken');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * LOGIN
 */
router.post('/login', authController.login);

/**
 * REGISTER (Warga)
 */
router.post('/register', authController.register);

/**
 * PROFILE
 */
router.get('/profile', authenticateToken, authController.getProfile);

/**
 * UPDATE PROFILE
 */
router.put('/profile', authenticateToken, authController.updateProfile);

module.exports = router;
