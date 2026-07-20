const express = require('express');

// Policies
const { isUser } = require('../../policies/isUser');

// Routes
const router = express.Router();

// Controllers;
const AuthController = require('../../controllers/auth/AuthController');

// Routes for controllers
router.post('/login', AuthController.login);

router.post('/register', AuthController.register);

router.post('/forget-password', AuthController.forgotPassword);

router.post('/reset-password', AuthController.resetPassword);

router.post('/change-password', [isUser], AuthController.changePassword);

router.post('/logout', [isUser], AuthController.logout);

// Export routes
module.exports = router;
