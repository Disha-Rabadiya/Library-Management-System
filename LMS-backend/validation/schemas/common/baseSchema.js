const { Joi } = require('../../common/joi');

const numberSchema = Joi.number();

const stringSchema = Joi.string();

const booleanSchema = Joi.boolean();

module.exports = {
  numberSchema,
  stringSchema,
  booleanSchema,
};
