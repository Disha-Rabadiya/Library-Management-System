const { STATUS, DRIVERS } = require('../../config/constants');
const { storageCore } = require('../helpers/storage/core/core');
// const { Media } = require('../models');

const deleteMedia = async () => {
  try {
    // // find media data that has to be deleted from database and selects its key
    // const mediaData = await Media.findAll({
    //   where: {
    //     status: STATUS.MEDIA.UPLOADED,
    //     isDeleted: false,
    //   },
    //   attributes: ['id', 'key', 'mediaType'],
    // });

    // let deleteMediaIds = [];

    // //if there are any medias to be deleted
    // if (mediaData.length > 0) {
    //   //iterates over media data
    //   for (item of mediaData) {
    //     deleteMediaIds = [...deleteMediaIds, item.id];

    //     //delete the media from storage with its key
    //     await storageCore(DRIVERS.STORAGE_ACTIONS.DELETE_FILE, {
    //       sourceFilePath: item.key,
    //       fileKey: [{ Key: item.key }],
    //     });
    //   }
    // }

    // //if there are any medias to be deleted
    // if (deleteMediaIds.length > 0) {
    //   //deletes medias from database
    //   await Media.destroy({
    //     where: { id: deleteMediaIds },
    //   });
    // }

    return { isError: false, data: true };
  } catch (err) {
    return { isError: true, data: err.message };
  }
};

module.exports = { deleteMedia };
