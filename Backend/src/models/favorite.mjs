import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
}, { timestamps: true });

export default mongoose.model('Favorite', favoriteSchema);
