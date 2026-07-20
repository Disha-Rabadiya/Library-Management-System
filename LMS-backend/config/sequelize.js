const { Sequelize } = require("sequelize");
const { adapter, url } = require("./datastores");
const isProduction = process.env.NODE_ENV === "production";

module.exports.sequelize = new Sequelize(url, {
  dialect: adapter,
  logging: false,

  dialectOptions: isProduction
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},

  // Connection Pool Configuration
  pool: {
    max: 5, // Maximum number of connections in the pool
    min: 0, // Minimum number of connections in the pool
    acquire: 30000, // The maximum time, in milliseconds, that a connection can be idle before being released
    idle: 10000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
  },
});
