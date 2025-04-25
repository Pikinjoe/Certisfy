import { Router } from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, loginUser } from '../controllers/userController.mjs'
import User from '../models/user.mjs'
import multer from 'multer';
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadsDir = process.env.NODE_ENV === 'production' ? '/tmp/uploads' : join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    console.log('Saving file to:', uploadsDir);
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
    console.log('Received photo upload request for user:', req.params.id);
    console.log('File received:', req.file);

    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      console.log('User not found:', req.params.id);
      return res.status(404).json({ message: "User not found" });
    }

    user.photoUrl = `/uploads/${req.file.filename}`;
    await user.save();
    console.log('Photo uploaded successfully:', user.photoUrl);

    res.json({ message: "Photo uploaded successfully", photoUrl: user.photoUrl });
  } catch (error) {
    console.error('Error in upload-photo route:', error);
    res.status(500).json({ message: "Failed to upload photo", error: error.message });
  }
  });
  
export default  router;