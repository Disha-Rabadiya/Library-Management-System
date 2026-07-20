require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const JWT = require('jsonwebtoken');
const BCRYPT = require('bcryptjs');
const { Op } = require('sequelize');
const { DataTypes } = require('sequelize');
const PATH = require('path');
const HANDLEBARS = require('handlebars');
const FS = require('fs');
const UTIL = require('util');
const MULTER = require('multer');
const JOI = require('joi');
const NODEMAILER = require('nodemailer');

// Response Codes
const HTTP_STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  SERVER_ERROR: 500,
};

const STATUS = {
  MEDIA: {
    UPLOADED: 'uploaded',
    FAIL: 'failed',
    ATTACHED: 'attached',
  },
  SQS: {
    PENDING: 'P',
    IN_PROGRESS: 'IP',
    ERROR: 'E',
  },
};

// JWT Expiry
const TOKEN_EXPIRY = {
  USER_ACCESS_TOKEN: '1d',
  USER_FORGOT_PASSWORD_TOKEN: 60 * 60, // 1 hour
};

const TEMPLATE_BASE_PATH = 'assets/templates';

const FILE_CONSTANTS = {
  TYPES: {
    IMAGE: {
      FLAG: 'I',
      CONTENT_TYPES: ['image/png', 'image/jpg', 'image/jpeg'],
    },
    VIDEO: {
      FLAG: 'V',
      CONTENT_TYPES: ['video/quicktime', 'video/x-ms-wmv', 'video/mp4'],
    },
  },
  UPLOAD: {
    PATH: 'uploads/',
  },
  TEST: {
    PATH: 'test/',
    SIZE: 10 * 1024 * 1024,
    CONTENT_TYPES: ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'],
  },
  MAX_SIZE: 1 * 1024 * 1024 * 1024, // 1 GB file size limit
};

const ROLES = {
  ADMIN: 'admin',
  LIBRARIAN: 'librarian',
  STUDENT: 'student',
};

const PAGE_NAMES = {
  USER_RESET_PASSWORD: 'reset-password',
};

const SQS_EVENTS = {
  MAIL: {
    USER_FORGOT_PASSWORD: 'user-forgot-password',
  },
};

// Export constants
module.exports = {
  UUID: uuidv4,
  JWT,
  BCRYPT,
  Op,
  DataTypes,
  PATH,
  HANDLEBARS,
  FS,
  UTIL,
  MULTER,
  JOI,
  HTTP_STATUS_CODE,
  TOKEN_EXPIRY,
  TEMPLATE_BASE_PATH,
  FILE_CONSTANTS,
  ROLES,
  PAGE_NAMES,
  SQS_EVENTS,
  NODEMAILER,
};
