const {
  FILE_CONSTANTS,
  MULTER,
  FS,
  UUID,
  PATH,
  DRIVERS,
} = require('./constants');

const dirName = process.env.STATIC_FOLDER + process.env.STATIC_TEMP_PATH;

// Make directory if it does not exist
if (!FS.existsSync(dirName)) {
  FS.mkdirSync(dirName, { recursive: true });
}
// Use memory storage to keep file in buffer
// const storage = MULTER.memoryStorage();

const storage = MULTER.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dirName);
  },
  filename: (req, file, cb) => {
    cb(null, `${UUID()}${PATH.extname(file.originalname)}`);
  },
});

// const fileFilter = (req, file, cb) => {
//   const allowedFileTypes = ['.jpeg', '.jpg', '.png', '.gif'];
//   if (
//     allowedFileTypes.includes(path.extname(file.originalname).toLowerCase())
//   ) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only image files are allowed.'));
//   }
// };

const upload = MULTER({
  storage: storage,
  limits: {
    fileSize: FILE_CONSTANTS.MAX_SIZE,
    // fieldSize: FILE_CONSTANTS.MAX_SIZE,
  },
  // fileFilter: fileFilter,
});

module.exports = upload;
