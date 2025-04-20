import data from '../data/data.json'


const getAllProducts = (req, res) => {
    res.json(data.products)
}

const getProductById = (req, res) => {
    const product = data.products.find(c => c.id === req.params.id)
    if(!product) return res.status(404).json({message: 'product not found'});
    res.json(product)
}


export {getAllProducts, getProductById}