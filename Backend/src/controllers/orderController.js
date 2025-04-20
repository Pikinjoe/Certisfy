import data from '../data/data.json'

const getAllOrders = (req, res) => {
    res.json(data.orders)
}

const getOrderById = (req, res) => {
    const order = data.orders.find(c => c.id === req.params.id)
    if(!order) return res.status(404).json({message: 'order not found'});
    res.json(order)
}

const createOrder = (req, res) => {
    const neworder = {id: Date.now().toString(), ...req.body}
    data.orders.push(neworder)
    res.status(201).json(neworder)
}

const updateOrder = (req, res) => {
    const orderIndex = data.orders.findIndex(c => c.id === req.params.id)
    if(orderIndex === -1 ) return res.status(404).json({message: 'order not found'});
    data.orders[orderIndex] = { ...data.orders[orderIndex], ...req.body}
    res.json(data.orders[orderIndex])
}

const deleteOrder = (req, res) => {
    const orderIndex = data.orders.findIndex(c => c.id === req.params.id)
    if(orderIndex === -1 ) return res.status(404).json({message: 'order not found'});
    data.orders.splice(orderIndex, 1)
    res.status(204).send()
}

export {getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder,}