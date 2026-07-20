const { FS, UTIL } = require('../../../../config/constants');
const { promisify } = UTIL;
const readFile = promisify(FS.readFile);
const writeFile = promisify(FS.writeFile);
const unlink = promisify(FS.unlink);

const uploadFile = async ({
  sourceFilePath,
  destinationFilePath,
  fileName,
}) => {
  try {
    //make directory if not exists
    if (!FS.existsSync(destinationFilePath)) {
      FS.mkdirSync(destinationFilePath, { recursive: true });
    }

    destinationFilePath = destinationFilePath + fileName;

    // Read the file
    const data = await readFile(sourceFilePath);

    // Write the contents to the destination file
    await writeFile(destinationFilePath, data);

    // Delete the source file
    await unlink(sourceFilePath);

    return {
      isError: false,
      data: {
        url:
          process.env.BASE_URL + destinationFilePath.replace(/^public\//, ''),
        key: destinationFilePath,
      },
    };
  } catch (err) {
    console.log('error in upload file helper', err);
    // Delete the source file
    await unlink(sourceFilePath);

    return { isError: true, data: err.message };
  }
};

module.exports = uploadFile;
