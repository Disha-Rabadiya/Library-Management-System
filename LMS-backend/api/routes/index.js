// Import express
const express = require('express');

// Create router
const Router = express.Router();

const AuthRoutes = require('./auth');

// Use routers
Router.use('/', [AuthRoutes]);

// Export routers
module.exports = Router;
