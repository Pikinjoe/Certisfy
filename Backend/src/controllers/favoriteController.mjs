import { loadData, saveDataToFile } from "../utils/loadJSON.mjs";

const getAllFavorites = async (req, res) => {
  const data = await loadData()

    const { userId } = req.query
    if (userId) {
        const userFavorites = data.favorites.filter(fav => fav.userId === userId);
        return res.json(userFavorites);
      }
      res.json(data.favorites);
}

const createFavorite = async (req, res) => {
  const data = await loadData();

    const newFavorite = { id: Date.now().toString(), ...req.body };
    data.favorites.push(newFavorite);
    try {
      await saveDataToFile();
      res.status(201).json(newFavorite);
    } catch (error) {
      res.status(500).json({ message: "Failed to create favorite" });
    }
  };
  
  const deleteFavorite = async (req, res) => {
    const data = await loadData();

    const favoriteIndex = data.favorites.findIndex(c => c.id === req.params.id);
    if (favoriteIndex === -1) return res.status(404).json({ message: 'Favorite not found' });
    data.favorites.splice(favoriteIndex, 1);
    try {
      await saveDataToFile(data);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete favorite" });
    }
  };

export { getAllFavorites, createFavorite, deleteFavorite,}