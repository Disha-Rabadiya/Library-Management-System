const { Joi } = require('../../common/joi');
const {
  stringSchema,
  booleanSchema,
  numberSchema,
} = require('../common/baseSchema');
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,50}$/;

const loginSchema = Joi.object({
  email: stringSchema.email().required(),
  password: stringSchema.pattern(passwordRegex).min(8).max(50).required(),
});

const registerSchema = Joi.object({
  firstName: stringSchema.min(1).max(100).required(),
  lastName: stringSchema.min(1).max(100).required(),
  email: stringSchema.email().required(),
  password: stringSchema.pattern(passwordRegex).min(8).max(50).required(),
  confirmPassword: stringSchema
    .pattern(passwordRegex)
    .min(8)
    .max(50)
    .required(),
});

const forgotPasswordSchema = Joi.object({
  email: stringSchema.email().required(),
  language: stringSchema.optional(),
});

const resetPasswordSchema = Joi.object({
  password: stringSchema.pattern(passwordRegex).min(8).max(50).required(),
  confirmPassword: stringSchema.valid(Joi.ref('password')).required(),
  token: stringSchema.required(),
});

const changePasswordSchema = Joi.object({
  oldPassword: stringSchema.pattern(passwordRegex).min(8).max(50).required(),
  newPassword: stringSchema.pattern(passwordRegex).min(8).max(50).required(),
});

module.exports = {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};
