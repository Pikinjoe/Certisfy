import { Router } from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, loginUser } from '../controllers/userController.mjs'

const router = Router()

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.post('/login', loginUser)

export default  router;