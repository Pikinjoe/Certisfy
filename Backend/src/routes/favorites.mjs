import { Router } from "express";
import { getAllFavorites,  createFavorite, deleteFavorite } from '../controllers/favoriteController.mjs'

const router = Router()

router.get('/', getAllFavorites)
router.post('/', createFavorite)
router.delete('/:id', deleteFavorite)

export default  router;