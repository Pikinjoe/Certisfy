import Order from "../models/order.mjs";
import mongoose from "mongoose";

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

const getOrderById = async (req, res) => {
  const { userId } = req.params;
  try {
    const userOrders = await Order.find({ userId });
    res.json(userOrders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

const createOrder = async (req, res) => {
  const { userId, items, subtotal, shipping, tax, total, deliveryDate, orderDate, status } = req.body;

  if (!userId || !items || !Array.isArray(items) || items.length === 0) { // Add Array check for items
    return res.status(400).json({ message: "userId and items are required and items must be a non-empty array" });
  }

  if (typeof subtotal !== "number" || typeof shipping !== "number" || typeof tax !== "number" || typeof total !== "number") {
    return res.status(400).json({ message: "subtotal, shipping, tax, and total must be numbers" });
  }

  if (!deliveryDate || !orderDate || !status) {
    return res.status(400).json({ message: "deliveryDate, orderDate, and status are required" });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  for (const item of items) {
    if (!item.productId || !mongoose.Types.ObjectId.isValid(item.productId)) {
      return res.status(400).json({ message: "Each item must have a valid productId" });
    }
    if (typeof item.quantity !== "number" || item.quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity in items" });
    }
    if (typeof item.price !== "number" || item.price < 0) { // Allow price to be 0
      return res.status(400).json({ message: "Invalid price in items" });
    }
  }

  try {
    const order = await Order.create({
      userId,
      items,
      subtotal,
      shipping,
      tax,
      total,
      deliveryDate,
      orderDate,
      status,
    });
    res.status(201).json(order);
  } catch (err) {
    console.error("Error in createOrder:", err.message, err.stack); // Add detailed logging
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order", error: err.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: "Order not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Failed to delete order", error: err.message });
  }
};

export { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder };
