import { loadData } from "../utils/loadJSON.mjs";

const getAllProducts = async (req, res) => {
    const data = await loadData();

    res.json(data.products)
}

const getProductById = async (req, res) => {
    const data = await loadData();

    const product = data.products.find(c => c.id === req.params.id)
    if(!product) return res.status(404).json({message: 'product not found'});
    res.json(product)
}


export {getAllProducts, getProductById}