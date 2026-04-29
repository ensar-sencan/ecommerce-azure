const router = require('express').Router();
const multer = require('multer');
const { uploadImage } = require('../config/azure');
const { authenticate, authorize } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed.'));
    }
    cb(null, true);
  },
});

router.post('/image',
  authenticate, authorize('seller', 'admin'),
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

      const ext = req.file.originalname.split('.').pop();
      const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const url = await uploadImage(req.file.buffer, filename, req.file.mimetype);

      res.json({ url });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
