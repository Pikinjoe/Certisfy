import Product from "../models/product.mjs";

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product", error: err.message });
  }
};

export { getAllProducts, getProductById };
