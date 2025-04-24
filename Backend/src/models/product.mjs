import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  category: String,
  name: String,
  price: Number,
  description: String,
  rating: Number,
  size: String,
  image: String
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
