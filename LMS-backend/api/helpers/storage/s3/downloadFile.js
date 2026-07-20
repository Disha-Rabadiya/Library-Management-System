const { S3 } = require('../../../../config/constants');

const downloadImage = async function (key) {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    };

    const s3Object = await S3.getObject(params).promise();
    return s3Object; // Return the entire S3 object
  } catch (error) {
    console.log('error: ', error);
    throw error; // Re-throw the error to be caught by the caller
  }
};

const downloadFile = async function ({ key }) {
  try {
    const s3Object = await downloadImage(key);

    const fileContent = s3Object.Body;

    return { isError: false, data: fileContent };
  } catch (error) {
    console.log('error in download file helper', error);
    return { isError: true, data: error.message };
  }
};

module.exports = downloadFile;
