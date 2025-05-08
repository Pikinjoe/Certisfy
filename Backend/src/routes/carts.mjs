import { Router } from "express";
import { getAllCarts, createCart, deleteCart, updateCart, deleteAllCarts } from '../controllers/cartController.mjs'

const router = Router()

router.get('/', getAllCarts)
router.post('/', createCart)
router.delete('/user', deleteAllCarts)
router.patch('/:id', updateCart)
router.delete('/:id', deleteCart)

export default  router;
