const multer = require('multer');
const path = require('path');

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext ==='.webp') {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG, webp files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = { upload };
