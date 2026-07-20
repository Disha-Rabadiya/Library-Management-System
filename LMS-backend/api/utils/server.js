// server.js (or your preferred filename for this module)

const { bootstrap } = require('../../config/bootstrap');
const { initializeCronJobs } = require('./initializeCron');

/**
 * Initializes and starts the server, performing necessary setup steps.
 *
 * @param {Object} app - The Express.js application instance.
 * @param {Sequelize} sequelize - The Sequelize instance connected to the database.
 * @param {number} port - The port number to start the server on.
 * @returns {Promise<void>} - A Promise that resolves when the server has started
 *                            successfully or rejects if there is an error.
 */
const startServer = async (server, sequelize, port) => {
  try {
    // Database Connection and Migration
    console.log('Connecting to database....');
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    // sequelize.sync({ alter: true, force: true });
    // Initialize Cron Jobs
    initializeCronJobs();

    // Bootstrap Your App
    await bootstrap();

    console.log('✅ Server started on port:' + port);
  } catch (error) {
    // Handle errors gracefully during startup
    console.error('❌ Error starting the server:', error);

    // Exit Process (optional, but often useful for critical startup errors)
    process.exit(1);
  }
};

module.exports = { startServer };
