import Cart from "../models/cart.mjs";
import mongoose from "mongoose";

const getAllCarts = async (req, res) => {
  try {
    const { userId, productId } = req.query;
    let query = {};
    if (userId) query.userId = userId;
    if (productId) query.productId = productId;
    const carts = await Cart.find(query);
    res.json(carts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch carts", error: err.message });
  }
};

const createCart = async (req, res) => {
  const { userId, productId, quantity = 1 } = req.body;
  try {
    let cart = await Cart.findOne({ userId, productId });
    if (cart) {
      cart.quantity += quantity;
      await cart.save();
    } else {
      cart = await Cart.create({ userId, productId, quantity });
    }
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to add/update cart", error: err.message });
  }
};

const updateCart = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid cart ID" });
  }

  
  const validatedQuantity = Number(quantity);
  if (isNaN(validatedQuantity)) {
    return res.status(400).json({ message: "Quantity must be a number" });
  }

  try {
    const cart = await Cart.findById(id);
    if (!cart) return res.status(404).json({ message: "Cart item not found" });

    if (validatedQuantity <= 0) {
      await cart.deleteOne();
      return res.status(200).json({ message: "Cart item deleted" });
    } else {
      cart.quantity = quantity;
      await cart.save();
      return res.status(200).json(cart);
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to update cart", error: err.message });
  }
};

const deleteCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Failed to delete cart", error: err.message });
  }
};

const deleteAllCarts = async (req, res) => {
  const { userId } = req.query; // Change to req.query
  console.log("Received userId in deleteAllCarts:", userId);
  if (!userId) return res.status(400).json({ message: "User ID is required" });

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  try {
    await Cart.deleteMany({ userId });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Failed to delete all carts", error: err.message });
  }
};

export { getAllCarts, createCart, updateCart, deleteCart, deleteAllCarts };
