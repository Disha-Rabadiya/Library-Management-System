const fs = require('fs');
const { S3 } = require('../../../../config/constants');

const uploadFile = async ({
  sourceFilePath,
  destinationDir,
  contentType,
  fileName,
  isPublic = true,
}) => {
  try {
    let fileContent = fs.readFileSync(sourceFilePath);

    // upload file to S3
    const fileParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${destinationDir}${fileName}`,
      Body: fileContent,
      ACL: isPublic ? 'public-read' : 'private',
      ContentType: contentType,
      region: process.env.AWS_S3_REGION,
    };

    let data = await S3.upload(fileParams).promise();

    // delete file from local
    fs.unlinkSync(sourceFilePath);

    return { isError: false, data };
  } catch (err) {
    console.log('error in upload file s3 helper', err);
    // delete file from local
    fs.unlinkSync(sourceFilePath);

    return { isError: true, data: err.message };
  }
};

module.exports = uploadFile;
