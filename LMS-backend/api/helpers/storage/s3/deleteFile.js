const { S3 } = require('../../../../config/constants');

const deleteFile = async function ({ fileKey }) {
  try {
    var options = {
      Bucket: process.env.AWS_S3_BUCKET,
      Delete: {
        Objects: fileKey,
      },
    };

    let data = await S3.deleteObjects(options).promise();

    return { isError: false, data };
  } catch (error) {
    console.log('error in delete file helper', error);
    return { isError: true, data: error.message };
  }
};

module.exports = deleteFile;
