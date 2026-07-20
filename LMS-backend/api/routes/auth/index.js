// Import express
const express = require('express');

// Import routers
const AuthRouter = require('./authRoutes');

// Create router
const Router = express.Router();

// Use routers
Router.use('/auth', [AuthRouter]);

// Export routers
module.exports = Router;
