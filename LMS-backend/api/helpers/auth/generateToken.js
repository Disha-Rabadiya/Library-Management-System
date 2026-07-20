const { JWT } = require('../../../config/constants');

const generateToken = async function (payload, expiry) {
  try {
    const token = await JWT.sign(
      //payload
      payload,

      //secret key
      process.env.JWT_KEY,

      //expiration time
      {
        expiresIn: expiry,
      }
    );

    return token;
  } catch (error) {
    throw error;
  }
};

module.exports = { generateToken };
