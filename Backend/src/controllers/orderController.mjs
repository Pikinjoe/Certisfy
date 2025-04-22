import { loadData, saveDataToFile } from "../utils/loadJSON.mjs";

const getAllOrders = async (req, res) => {
  const data = await loadData();

  res.json(data.orders);
};

const getOrderById = async (req, res) => {
  const { userId } = req.params;
  const data = await loadData();

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const userOrders = data.orders.filter((order) => order.userId === userId);
  res.json(userOrders);
};

const createOrder = async (req, res) => {
  const data = await loadData();
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const neworder = { id: Date.now().toString(),userId, ...req.body };
  data.orders.push(neworder);
  res.status(201).json(neworder);

  try {
    await saveDataToFile(data);
    res.status(201).json(neworder);
  } catch (error) {
    data.orders.pop(); // rollback if save fails
    res
      .status(500)
      .json({ message: "Failed to save order", error: error.message });
  }
};

const updateOrder = async (req, res) => {
  const data = await loadData();

  const orderIndex = data.orders.findIndex((c) => c.id === req.params.id);
  if (orderIndex === -1)
    return res.status(404).json({ message: "order not found" });

  const original = { ...data.orders[orderIndex] }; // backup for rollback
  data.orders[orderIndex] = { ...data.orders[orderIndex], ...req.body };

  try {
    await saveDataToFile(data);
    res.json(data.orders[orderIndex]);
  } catch (error) {
    data.orders[orderIndex] = original;
    res
      .status(500)
      .json({ message: "Failed to update order", error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  const data = await loadData();

  const orderIndex = data.orders.findIndex((c) => c.id === req.params.id);
  if (orderIndex === -1)
    return res.status(404).json({ message: "order not found" });
  const deletedOrder = data.orders.splice(orderIndex, 1)[0];

  try {
    await saveDataToFile(data);
    res.status(204).send();
  } catch (error) {
    data.orders.splice(orderIndex, 0, deletedOrder);
    res
      .status(500)
      .json({ message: "Failed to delete order", error: error.message });
  }
};

export { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder };
