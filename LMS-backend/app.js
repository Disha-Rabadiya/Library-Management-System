// Load environment variables
require('dotenv').config();

// Load modules
const express = require('express');
const bodyParser = require('body-parser');
const CORS = require('cors');

// Load utilities
const { createServer } = require('http');
const { I18n } = require('i18n');

// Load routes
const router = require('./config/routes');

// Load config
const { locales, defaultLocale } = require('./config/i18n');
const { cors } = require('./config/security');

// Load database
const { sequelize } = require('./api/models');
const { startServer } = require('./api/utils/server');
const { initializeRedis } = require('./config/redis');

const { getLanguage } = require('./api/policies/getLanguage');

// Load i18n
const i18n = new I18n({
  locales,
  directory: __dirname + '/config/locales',
  defaultLocale,
  objectNotation: true,
  updateFiles: false,
});

// Create express app
const app = express();
const server = createServer(app);

if (process.env.ENABLE_RATE_LIMIT === 'Y') {
  const rateLimit = require('express-rate-limit');

  // Create a rate limiter middleware
  const limiter = rateLimit({
    windowMs: +process.env.RATE_LIMIT_WINDOWS_MS, // 15 minutes
    max: +process.env.RATE_LIMIT_MAX, // limit each IP to 100 requests per windowMs
    message: { error: process.env.RATE_LIMIT_ERROR_MESSAGE }, // Custom error message
    standardHeaders: true, // Return X-RateLimit-* headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

  // Apply to all requests
  app.use(limiter);
}

// CORS setup
app.use(CORS(cors));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const fs = require('fs');

// Make directory if it does not exist
if (!fs.existsSync(process.env.STATIC_FOLDER + process.env.STATIC_TEMP_PATH)) {
  fs.mkdirSync(process.env.STATIC_FOLDER + process.env.STATIC_TEMP_PATH, {
    recursive: true,
  });
}

if (!fs.existsSync(process.env.STATIC_FOLDER + '/uploads')) {
  fs.mkdirSync(process.env.STATIC_FOLDER + '/uploads', {
    recursive: true,
  });
}

app.use(express.static('public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

// Set i18n
app.use(i18n.init);

// Routes
app.use(getLanguage);
app.use(router);

// Start server
const port = process.env.PORT || 3001;
server.listen(port, async () => {
  await startServer(server, sequelize, port);
});
