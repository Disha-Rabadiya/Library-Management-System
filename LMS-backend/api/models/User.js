const { DataTypes } = require('sequelize');
const { models } = require('../../config/models');
const { USER_STATUS } = require('../../config/constants');
const { sequelize } = require('../../config/sequelize');

const User = sequelize.define(
  'User',
  {
    firstName: {
      type: DataTypes.STRING(100),
      field: 'first_name',
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      field: 'last_name',
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    countryCode: {
      type: DataTypes.STRING(5),
      allowNull: true,
      field: 'country_code',
    },
    registrationType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'email',
      field: 'registration_type',
    },
    forgotPasswordToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'forgot_password_token',
    },
    forgotPasswordTokenExpiry: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'forgot_password_token_expiry',
    },
    lastLoginAt: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'last_login_at',
    },
    roleId: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: 'role_id',
    },
    profilePicId: {
      type: DataTypes.STRING(40),
      allowNull: true,
      field: 'profile_pic_id',
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    ...models.defaultAttributes,
  },
  {
    tableName: 'user',
    freezeTableName: true,
    timestamps: false,
  }
);

User.associate = (models) => {
  User.belongsTo(models.Role, {
    foreignKey: 'roleId',
    as: 'role',
  });

  User.belongsTo(models.Media, {
    foreignKey: 'profilePicId',
    as: 'profilePicture',
  });
};

module.exports = User;
