import multer from 'multer';
import path from 'path';

// Setup storage engine
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // For now, we will just use memory or a temp folder if uploading to cloudinary directly.
    // If saving locally before Cloudinary:
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// We can also use memoryStorage for direct upload to cloudinary without saving to disk
const memoryStorage = multer.memoryStorage();

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage: memoryStorage, // Using memory storage for Cloudinary
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;
