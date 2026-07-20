const { DataTypes } = require('sequelize');
const { models } = require('../../config/models');
const { STATUS } = require('../../config/constants');
const { sequelize } = require('../../config/sequelize');

const Media = sequelize.define(
  'Media',
  {
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'file_name',
    },
    filePath: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'file_path',
    },
    originalName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'original_name',
    },
    contentType: {
      type: DataTypes.STRING(128),
      allowNull: false,
      field: 'content_type',
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: STATUS.MEDIA.UPLOADED,
    },
    mediaType: {
      type: DataTypes.STRING(15),
      allowNull: false,
      field: 'media_type',
    },
    isConverted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_converted',
    },
    convertedSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'converted_size',
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_public',
    },
    ...models.defaultAttributes,
  },
  {
    tableName: 'media',
    freezeTableName: true,
    timestamps: false,
  }
);

Media.associate = (models) => {
  Media.hasMany(models.User, {
    foreignKey: 'profilePicId',
    as: 'users',
  });

  Media.hasMany(models.Book, {
    foreignKey: 'coverImageId',
    as: 'books',
  });

  Media.hasMany(models.Category, {
    foreignKey: 'imageId',
    as: 'categories',
  });

  Media.hasMany(models.Author, {
    foreignKey: 'photoId',
    as: 'authors',
  });

  Media.hasMany(models.Publisher, {
    foreignKey: 'logoId',
    as: 'publishers',
  });
};

module.exports = Media;
