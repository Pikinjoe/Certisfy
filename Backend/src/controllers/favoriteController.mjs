import data from '../data/data.json' assert {type: 'json'}
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_FILE_PATH = join(__dirname, "../data/data.json");

const saveDataToFile = async () => {
    try {
      await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
      console.log("Data saved to file successfully");
    } catch (error) {
      console.error("Error saving data to file:", error);
      throw new Error("Failed to save data");
    }
  };

const getAllFavorites = (req, res) => {
    const { userId } = req.query
    if (userId) {
        const userFavorites = data.favorites.filter(fav => fav.userId === userId);
        return res.json(userFavorites);
      }
      res.json(data.favorites);
}

const createFavorite = async (req, res) => {
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
    const favoriteIndex = data.favorites.findIndex(c => c.id === req.params.id);
    if (favoriteIndex === -1) return res.status(404).json({ message: 'Favorite not found' });
    data.favorites.splice(favoriteIndex, 1);
    try {
      await saveDataToFile();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete favorite" });
    }
  };

export { getAllFavorites, createFavorite, deleteFavorite,}