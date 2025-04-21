import { loadData } from "../utils/loadJSON.mjs";

const getAllOrders = async (req, res) => {
    const data = await loadData();

    res.json(data.orders)
}

const getOrderById = async (req, res) => {
    const data = await loadData();

    const order = data.orders.find(c => c.id === req.params.id)
    if(!order) return res.status(404).json({message: 'order not found'});
    res.json(order)
}

const createOrder = async (req, res) => {
    const data = await loadData();

    const neworder = {id: Date.now().toString(), ...req.body}
    data.orders.push(neworder)
    res.status(201).json(neworder)
}

const updateOrder = async (req, res) => {
    const data = await loadData();

    const orderIndex = data.orders.findIndex(c => c.id === req.params.id)
    if(orderIndex === -1 ) return res.status(404).json({message: 'order not found'});
    data.orders[orderIndex] = { ...data.orders[orderIndex], ...req.body}
    res.json(data.orders[orderIndex])
}

const deleteOrder =async (req, res) => {
    const data = await loadData();

    const orderIndex = data.orders.findIndex(c => c.id === req.params.id)
    if(orderIndex === -1 ) return res.status(404).json({message: 'order not found'});
    data.orders.splice(orderIndex, 1)
    res.status(204).send()
}

export {getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder,}