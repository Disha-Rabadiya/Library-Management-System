const { S3 } = require('../../../../config/constants');

const getSignedUrl = async function (url) {
  try {
    let fileUrl = new URL(url);
    let key = fileUrl.pathname.substr(1);
    let fileParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Expires: 3 * 60 * 60,
    };

    const data = await S3.getSignedUrlPromise('getObject', fileParams);

    return { isError: false, data };
  } catch (error) {
    console.log('error in delete file helper', error);
    return { isError: true, data: error.message };
  }
};

module.exports = getSignedUrl;
