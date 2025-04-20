import { Router } from "express";
import { getAllFavorites,  createFavorite, deleteFavorite } from '../controllers/favoriteController.js'

const router = Router()

router.get('/', getAllFavorites)
router.post('/', createFavorite)
router.delete('/:id', deleteFavorite)

export default  router;