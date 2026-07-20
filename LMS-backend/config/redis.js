// redis.js
const redis = require('redis');

let redisClient;

const initializeRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error', err);
    });

    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Failed to connect to Redis', error);
    throw error; // Ensure the initialization error is surfaced
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized.');
  }
  return redisClient;
};

module.exports = { initializeRedis, getRedisClient };
