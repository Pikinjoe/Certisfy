import { Router } from "express";
import { getAllReviews, createReview } from '../controllers/reviewController.js'

const router = Router()

router.get('/', getAllReviews)
router.post('/', createReview)
export default  router;