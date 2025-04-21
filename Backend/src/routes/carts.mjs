import { Router } from "express";
import { getAllCarts, createCart, deleteCart, updateCart, deleteAllCarts } from '../controllers/cartController.js'

const router = Router()

router.get('/', getAllCarts)
router.post('/', createCart)
//router.delete('/:id', deleteCart)
router.patch('/:id', updateCart)
router.delete('/user', deleteAllCarts)

export default  router;
