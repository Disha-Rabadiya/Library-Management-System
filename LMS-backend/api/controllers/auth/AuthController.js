const {
  HTTP_STATUS_CODE,
  BCRYPT,
  TOKEN_EXPIRY,
  ROLES,
  PAGE_NAMES,
  SQS_EVENTS,
  UUID,
} = require('../../../config/constants');
const {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require('../../../validation/schemas/Auth/authSchema');
const { generateToken } = require('../../helpers/auth/generateToken');
const { processMailMsgs } = require('../../helpers/mail/processMailMessages');
const Role = require('../../models/Role');
const User = require('../../models/User');

module.exports = {
  /**
   * @name login
   * @file AuthController.js
   * @param {Request} req
   * @param {Response} res
   * @throwsF
   * @description Login
   * @author Krushita Gajera
   */
  login: async (req, res) => {
    try {
      //get email password from body
      let { email, password } = req.body;
      /* The code block you mentioned is performing validation on the `email` and `password` fields
             received in the request body. */
      const { error } = loginSchema.validate(req.body);
      if (error) {
        //if any rule is violated
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'missing required fields',
          data: '',
          error: error.details,
        });
      }

      const user = await User.findOne({
        where: {
          email: email.toLowerCase(),
          isDeleted: false,
        },
      });

      if (!user) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'user not found',
          data: '',
          error: '',
        });
      }

      /* This code is comparing the password entered by the admin with the hashed password stored in the
             database for the admin. */
      const comparePassword = await BCRYPT.compareSync(password, user.password);

      /* This code block is checking if the entered password matches the hashed password stored in the
          database for the admin. If the passwords do not match, it returns a response with a status code
          of 400 (Bad Request) */
      if (!comparePassword) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Invalid email or password.',
          data: '',
          error: '',
        });
      }

      const role = await Role.findOne({
        where: {
          id: user.roleId,
        },
      });
      /* The `payload` object is used to store the admin data that will be used to generate a token.*/
      const payload = {
        id: user.id,
        email: email.toLowerCase(),
        role: role.name,
      };

      const token = await generateToken(
        payload,
        TOKEN_EXPIRY.USER_ACCESS_TOKEN
      );

      const lastLoginAt = Math.floor(Date.now() / 1000);
      await User.update(
        {
          token,
          lastLoginAt,
        },
        {
          where: {
            id: user.id,
          },
        }
      );
      user.token = token;

      //return success response
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: 'User logged in successfully!',
        data: user,
        error: '',
      });
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: 'Internal Server Error',
        data: '',
        error: error.message,
      });
    }
  },

  /**
   * @name register
   * @file AuthController.js
   * @param {Request} req
   * @param {Response} res
   * @throwsF
   * @description Register
   * @author Krushita Gajera
   */
  register: async (req, res) => {
    try {
      //get email password from body
      let { firstName, lastName, email, password, confirmPassword } = req.body;
      /* The code block you mentioned is performing validation on the `email` and `password` fields
             received in the request body. */
      const { error } = registerSchema.validate(req.body);
      if (error) {
        //if any rule is violated
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'missing required fields',
          data: '',
          error: error.details,
        });
      }

      const existingUser = await User.findOne({
        where: {
          email: email.toLowerCase(),
          isDeleted: false,
        },
      });

      if (existingUser) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'user already exists',
          data: '',
          error: '',
        });
      }

      if (password !== confirmPassword) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Passwords do not match',
          data: '',
          error: '',
        });
      }

      const role = await Role.findOne({
        where: {
          name: ROLES.STUDENT,
          isDeleted: false,
        },
      });

      const hash = BCRYPT.hashSync(password, 10);
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hash,
        roleId: role.id,
      });

      //return success response
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: 'User registered successfully',
        data: user,
        error: '',
      });
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: 'Internal Server Error',
        data: '',
        error: error.message,
      });
    }
  },

  /**
   * @name forgotPassword
   * @file AuthController.js
   * @param {Request} req
   * @param {Response} res
   * @throwsF
   * @description This method will send reset password link to admin's email
   * @author Krushita Gajera
   */
  forgotPassword: async (req, res) => {
    try {
      //get email from body
      let { email, language } = req.body;
      language = language || 'en';

      /* The below code is is performing validation on the `req.body` object using the
      `schema`. If there is an error during validation (i.e., if any rule is
      violated), it will return a response with a status code of 400 (Bad Request) along with an
      error object containing details about the validation error. */
      const { error } = forgotPasswordSchema.validate(req.body);

      if (error) {
        //if any rule is violated
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'missing required fields',
          data: '',
          error: error.details,
        });
      }

      const existingUser = await User.findOne({
        where: {
          email: email.toLowerCase(),
          isDeleted: false,
        },
      });

      if (existingUser) {
        //generating token
        const token = UUID();

        //sets forget password token expiry in seconds in admin data
        const forgotPwdExp =
          Math.floor(Date.now() / 1000) +
          TOKEN_EXPIRY.USER_FORGOT_PASSWORD_TOKEN;

        //updating token for admin
        await User.update(
          {
            forgotPasswordToken: token,
            forgotPasswordTokenExpiry: forgotPwdExp,
          },
          {
            where: {
              id: existingUser.id,
            },
          }
        );
        /* The below code is sending a message to a queue for processing. It creates a payload object
            with properties email, name, and token. Then, it uses the queue helper
            function to send a message to the queue with particular type (Mail), subtype (admin-forgot-password) The message type is set to EVENT_TYPES.MAIL  */

        const payload = {
          email: email.toLowerCase(),
          name: `${existingUser.firstName} ${existingUser.lastName}`,
          url: `${process.env.FRONTEND_BASE_URL}${language}/${PAGE_NAMES.USER_RESET_PASSWORD}?id=${existingUser.id}&token=${token}`,
          token,
        };

        //send mail
        processMailMsgs({
          msgData: {
            subtype: SQS_EVENTS.MAIL.USER_FORGOT_PASSWORD,
            payload: payload,
          },
        }).catch(async (err) => {
          throw err;
        });
      }
      //return success response
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message:
          'If an account with this email exists, a password reset link has been sent.',
        data: '',
        error: '',
      });
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: 'Internal Server Error',
        data: '',
        error: error.message,
      });
    }
  },

  /**
   * @name resetPassword
   * @file AuthController.js
   * @param {Request} req
   * @param {Response} res
   * @throwsF
   * @description This method will check token and its expiry then reset the password in system
   * @author Krushita Gajera
   */
  resetPassword: async (req, res) => {
    try {
      //get password, confirmPassword and token from body
      let { password, confirmPassword, token } = req.body;

      /* The below code is is performing validation on the `req.body` object using the
      `schema`. If there is an error during validation (i.e., if any rule is
      violated), it will return a response with a status code of 400 (Bad Request) along with an
      error object containing details about the validation error. */
      const { error } = resetPasswordSchema.validate(req.body);

      if (error) {
        //if any rule is violated
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'missing required fields',
          data: '',
          error: error.details,
        });
      }

      const user = await User.findOne({
        where: {
          forgotPasswordToken: token,
          isDeleted: false,
        },
      });

      if (!user) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'User not found',
          data: '',
          error: '',
        });
      }

      if (password !== confirmPassword) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Passwords do not match',
          data: '',
          error: '',
        });
      }

      // compares admin password with given password
      const comparePassword = await BCRYPT.compareSync(password, user.password);

      // if same password as old password
      if (comparePassword) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'New password must be different from the old one',
          data: '',
          error: '',
        });
      }

      //check for forgot password token
      if (user.forgotPasswordToken !== token) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Invalid or expired link',
          data: '',
          error: '',
        });
      }

      //gets forget password token expiry from admin data in milliseconds
      const forgotPwdTokenExpiry = user.forgotPasswordTokenExpiry * 1000;

      //checks for forget password token expiry
      if (forgotPwdTokenExpiry < Date.now()) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Invalid or expired link',
          data: '',
          error: '',
        });
      }

      //hash the new password with bcrypt package
      const hash = await BCRYPT.hashSync(password, 10);
      const updatedAt = Math.floor(Date.now() / 1000);
      //update password for the admin and set null values to forget password token and its expiry in database
      await User.update(
        {
          password: hash,
          forgotPasswordToken: null,
          forgotPasswordTokenExpiry: 0,
          token: null,
          updatedAt,
          updatedBy: user.id,
        },
        {
          where: {
            id: user.id,
            isDeleted: false,
          },
        }
      );

      //return success response
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: 'Password reset successfully.',
        data: '',
        error: '',
      });
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: 'Internal Server Error',
        data: '',
        error: error.message,
      });
    }
  },

  /**
   * @name changePassword
   * @file AuthController.js
   * @param {Request} req
   * @param {Response} res
   * @throwsF
   * @description This method used to change password
   * @author Krushita Gajera
   */
  changePassword: async (req, res) => {
    try {
      //get  password, token from body
      let { oldPassword, newPassword } = req.body;

      const id = req.me.id;
      /* The below code is is performing validation on the `req.body` object using the
      `schema`. If there is an error during validation (i.e., if any rule is
      violated), it will return a response with a status code of 400 (Bad Request) along with an
      error object containing details about the validation error. */
      const { error } = changePasswordSchema.validate({
        oldPassword,
        newPassword,
      });

      if (error) {
        //if any rule is violated
        return res
          .status(HTTP_STATUS_CchangePasswordSchemaODE.BAD_REQUEST)
          .json({
            status: HTTP_STATUS_CODE.BAD_REQUEST,
            message: 'missing required fields',
            data: '',
            error: error.details,
          });
      }

      const user = await User.findOne({
        where: {
          id,
          isDeleted: false,
        },
      });

      if (!user) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'User not found',
          data: '',
          error: '',
        });
      }

      const comparePassword = await BCRYPT.compareSync(
        oldPassword,
        user.password
      );
      const updatedAt = Math.floor(Date.now() / 1000);
      if (comparePassword) {
        const hash = await BCRYPT.hashSync(newPassword, 10);
        await user.update({
          password: hash,
          updatedAt,
          updatedBy: req.me.id,
        });
      } else {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Old password is wrong',
          data: '',
          error: '',
        });
      }

      //return success response
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: 'Password changed successfully.',
        data: user,
        error: '',
      });
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: 'Internal Server Error',
        data: '',
        error: error.message,
      });
    }
  },

  /**
   * @name logout
   * @file AuthController.js
   * @param {Request} req
   * @param {Response} res
   * @throwsF
   * @description This method used to logout
   * @author Krushita Gajera
   */
  logout: async (req, res) => {
    try {
      const id = req.me.id;

      const user = await User.findOne({
        where: {
          id,
          isDeleted: false,
        },
      });

      if (!user) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'User not found',
          data: '',
          error: '',
        });
      }

      await User.update(
        {
          token: null,
        },
        {
          where: {
            id,
            isDeleted: false,
          },
        }
      );

      //return success response
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: 'User logged out successfully.',
        data: '',
        error: '',
      });
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: 'Internal Server Error',
        data: '',
        error: error.message,
      });
    }
  },
};
