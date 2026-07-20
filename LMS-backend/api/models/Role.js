const { DataTypes } = require('sequelize');
const { models } = require('../../config/models');
const { sequelize } = require('../../config/sequelize');

const Role = sequelize.define(
  'Role',
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ...models.defaultAttributes,
  },
  {
    tableName: 'role',
    freezeTableName: true,
    timestamps: false,
  }
);

Role.associate = (models) => {
  Role.hasMany(models.User, {
    foreignKey: 'roleId',
    as: 'users',
  });
};

module.exports = Role;
