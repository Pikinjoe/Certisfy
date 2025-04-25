import { Router } from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, loginUser } from '../controllers/userController.mjs'

import multer from 'multer';
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: join(__dirname, '../../uploads'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const router = Router()

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.post('/login', loginUser)

router.post('/:id/upload-photo', upload.single('photo'), async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      user.photoUrl = `/uploads/${req.file.filename}`;
      await user.save();
      res.json({ message: "Photo uploaded successfully", photoUrl: user.photoUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to upload photo", error: error.message });
    }
  });
  
export default  router;