import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  price: Number
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [orderItemSchema],
  subtotal: Number,
  shipping: Number,
  tax: Number,
  total: Number,
  deliveryDate: Date,
  orderDate: { type: Date, default: Date.now },
  status: { type: String, default: 'placed' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
