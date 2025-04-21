import { Router } from "express";
import { getAllReviews, createReview } from '../controllers/reviewController.mjs'

const router = Router()

router.get('/', getAllReviews)
router.post('/', createReview)
export default  router;