const { HTTP_STATUS_CODE, JWT } = require('../../config/constants');
const User = require('../models/User');

module.exports.isUser = async (req, res, next) => {
  try {
    //getting authToken from headers
    let authToken = req.headers['authorization'];

    //check if authToken starts with Bearer, fetch the token or return error
    if (authToken && authToken.startsWith('Bearer ')) {
      //if token start with Bearer
      authToken = authToken.split(' ')[1];
    } else {
      //if token is not provided then send validation response
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
        message: 'Token not found',
        data: '',
        error: '',
      });
    }

    //verify jwt token based on jwt key
    let decodedToken = await JWT.verify(authToken, process.env.JWT_KEY);

    //check for decodedToken expiry
    if (
      decodedToken &&
      decodedToken.exp &&
      decodedToken.exp > Math.floor(Date.now() / 1000)
    ) {
      if (decodedToken.id) {
        let user = await User.findOne({
          where: {
            id: decodedToken.id,
            isDeleted: false,
          },
          attributes: ['id', 'email', 'token'],
        });

        if (!user) {
          //if admin is not found in database then send validation response
          return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
            status: HTTP_STATUS_CODE.UNAUTHORIZED,
            message: 'Invalid Token',
            data: '',
            error: '',
          });
        }

        /* checks token from header with current token stored in database for that admin
          if that doesn't matches then send validation response */
        if (user.token !== authToken) {
          return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
            status: HTTP_STATUS_CODE.UNAUTHORIZED,
            message: 'Invalid Token',
            data: '',
            error: '',
          });
        }

        req.me = user;
        next();
      } else {
        return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
          status: HTTP_STATUS_CODE.UNAUTHORIZED,
          message: 'Invalid Token',
          data: '',
          error: '',
        });
      }
    } else {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
        message: 'Token not found',
        data: '',
        error: '',
      });
    }
  } catch (error) {
    //if error is of jwt token expire then send validation response with errorcode 'AUTH004'
    if (error instanceof JWT.TokenExpiredError) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
        message: 'Token expired',
        data: '',
        error: '',
      });
    } else {
      //send server error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: 'Internal Server Error',
        data: '',
        error: error.message,
      });
    }
  }
};
