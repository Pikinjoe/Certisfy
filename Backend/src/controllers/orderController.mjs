import Order from "../models/order.mjs";

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
  const { userId, products, total, status, shippingAddress } = req.body;

  if (!userId || !products) {
    return res.status(400).json({ message: "User ID and products are required" });
  }

  try {
    const newOrder = await Order.create({ userId, products, total, status, shippingAddress });
    res.status(201).json(newOrder);
  } catch (err) {
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
