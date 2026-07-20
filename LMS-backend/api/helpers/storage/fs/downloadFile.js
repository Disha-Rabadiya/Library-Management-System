const { FS, UTIL } = require('../../../../config/constants');
const { promisify } = UTIL;

const downloadFile = async function ({ sourceFilePath }) {
  try {
    if (!FS.existsSync(sourceFilePath)) {
      return { isError: true, data: 'File does not exists!' };
    }

    const readFileAsync = promisify(FS.readFile);

    const data = await readFileAsync(sourceFilePath);

    return { isError: false, data };
  } catch (error) {
    console.log('error in download file helper', error);
    return { isError: true, data: error.message };
  }
};

module.exports = downloadFile;
