import Favorite from "../models/favorite.mjs";

const getAllFavorites = async (req, res) => {
  try {
    const { userId } = req.query;
    const favorites = userId ? await Favorite.find({ userId }) : await Favorite.find();
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch favorites", error: err.message });
  }
};

const createFavorite = async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ message: "UserId and productId are required" });
  }

  try {
    // Prevent duplicates
    const existing = await Favorite.findOne({ userId, productId });
    if (existing) {
      return res.status(409).json({ message: "Favorite already exists" });
    }

    const newFavorite = await Favorite.create({ userId, productId });
    res.status(201).json(newFavorite);
  } catch (err) {
    res.status(500).json({ message: "Failed to create favorite", error: err.message });
  }
};

const deleteFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findByIdAndDelete(req.params.id);
    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Failed to delete favorite", error: err.message });
  }
};

export { getAllFavorites, createFavorite, deleteFavorite };
