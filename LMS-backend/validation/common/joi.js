const { JOI } = require('../../config/constants');

const Joi = JOI.defaults((schema) =>
  schema.options({
    abortEarly: false,
    stripUnknown: true,
  })
);

module.exports = { Joi };
