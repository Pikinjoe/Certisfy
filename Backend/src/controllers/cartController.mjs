import data from "../data/data.json" assert { type: "json" };
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_FILE_PATH = join(__dirname, "../data/data.json");

const saveDataToFile = async () => {
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
    console.log("Data saved to file successfully");
  } catch (error) {
    console.error("Error saving data to file:", error);
    throw new Error("Failed to save data");
  }
};

const getAllCarts = (req, res) => {
  const { userId } = req.query;
  if (userId) {
    const userCarts = data.carts.filter((cart) => cart.userId === userId);
    return res.json(userCarts);
  }
  res.json(data.carts);
};

const createCart = async (req, res) => {
  const { userId, productId, quantity = 1 } = req.body; // Default quantity to 1 if not provided
  const existingCartIndex = data.carts.findIndex(
    (cart) => cart.userId === userId && cart.productId === productId
  );

  if (existingCartIndex !== -1) {
    // Item exists, increment quantity
    data.carts[existingCartIndex].quantity =
      (data.carts[existingCartIndex].quantity || 1) + quantity;
    try {
      await saveDataToFile();
      res.status(200).json(data.carts[existingCartIndex]);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart" });
    }
  } else {
    // New item, create entry
    const newCart = { id: Date.now().toString(), userId, productId, quantity };
    data.carts.push(newCart);
    try {
      await saveDataToFile();
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ message: "Failed to add to cart" });
    }
  }
};

const updateCart = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const cartIndex = data.carts.findIndex((cart) => cart.id === id);

  if (cartIndex === -1) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  if (quantity <= 0) {
    // Delete if quantity is 0 or less
    data.carts.splice(cartIndex, 1);
  } else {
    // Update quantity
    data.carts[cartIndex].quantity = quantity;
  }

  try {
    await saveDataToFile();
    res
      .status(200)
      .json(data.carts[cartIndex] || { message: "Cart item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart" });
  }
};

const deleteCart = async (req, res) => {
  const cartIndex = data.carts.findIndex((c) => c.id === req.params.id);
  if (cartIndex === -1)
    return res.status(404).json({ message: "Cart not found" });
  data.carts.splice(cartIndex, 1);
  try {
    await saveDataToFile();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete cart" });
  }
};

const deleteAllCarts = async (req, res) => {
  const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
  data.carts = data.carts.filter((cart) => cart.userId !== userId);
  try {
    await saveDataToFile();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete all carts" });
  }
};

export { getAllCarts, createCart, updateCart, deleteCart, deleteAllCarts };
