import { Router } from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, loginUser } from '../controllers/userController.mjs'
import User from '../models/user.mjs'
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import multer from 'multer';
import { fileURLToPath } from "url";
import { dirname, join } from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadsDir = process.env.NODE_ENV === 'production' ? '/tmp/uploads' : join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 5MB
 });

const router = Router()

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.post('/login', loginUser)

router.post('/:id/upload-photo', upload.single('photo'), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'certisfy_uploads',
      public_id: `user_${req.params.id}_${Date.now()}`,
    });

    await fs.unlink(req.file.path);


    user.photoUrl = result.secure_url;
    await user.save();
    res.json({ message: "Photo uploaded successfully", photoUrl: user.photoUrl });
  } catch (error) {
    console.error('Error in upload-photo route:', error);
    res.status(500).json({ message: "Failed to upload photo", error: error.message });
  }
  });
  
export default  router;