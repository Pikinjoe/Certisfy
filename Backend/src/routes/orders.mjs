import { Router } from "express";
import { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } from '../controllers/orderController.mjs'

const router = Router()

router.get('/', getAllOrders)
router.get('/order/:userId', getOrderById)
router.post('/', createOrder)
router.put('/:id', updateOrder)
router.delete('/:id', deleteOrder)

export default  router;