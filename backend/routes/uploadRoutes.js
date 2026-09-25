import path from 'path';
import express from 'express';
import multer from 'multer';
import { put } from '@vercel/blob';

const router = express.Router();

// Use memory storage for serverless environments (Vercel)
const storage = multer.memoryStorage();

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
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' });
    }

    // Generate a unique filename
    const filename = `${req.file.fieldname}-${Date.now()}${path.extname(req.file.originalname)}`;

    // Upload directly to Vercel Blob
    const { url } = await put(filename, req.file.buffer, {
      access: 'public',
      // The token is automatically picked up from process.env.BLOB_READ_WRITE_TOKEN
      // Ensure you have added this to your Vercel Environment Variables
    });

    res.send({
      message: 'Image Uploaded successfully to Vercel Blob',
      url: url, // This returns the permanent Vercel URL
    });
  } catch (error) {
    console.error('Vercel Blob Upload Error:', error);
    res.status(500).send({ message: 'Error uploading image', error: error.message });
  }
});

export default router;
