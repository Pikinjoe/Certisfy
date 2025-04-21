import { Router } from "express";
import { getAllProducts, getProductById } from '../controllers/productController.mjs'

const router = Router()

router.get('/', getAllProducts)
router.get('/:id', getProductById)

export default  router;