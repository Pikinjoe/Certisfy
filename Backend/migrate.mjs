import mongoose from "mongoose";
import fs from "fs/promises";
import dotenv from "dotenv";
import User from "./src/models/user.mjs";
import Product from "./src/models/product.mjs";
import Cart from "./src/models/cart.mjs";
import Order from "./src/models/order.mjs";
import Review from "./src/models/review.mjs";
import Favorite from "./src/models/favorite.mjs";

dotenv.config({ path: './Backend/.env' });

const migrateData = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Add this before inserting anything in migrate.mjs:
await User.deleteMany({});
await Product.deleteMany({});
await Cart.deleteMany({});
await Order.deleteMany({});
await Review.deleteMany({});
await Favorite.deleteMany({});

  const file = await fs.readFile("./Backend/src/data/data.json", "utf-8");
  const data = JSON.parse(file);

  const userMap = {};
  const productMap = {};

  for (const u of data.users || []) {
    const { id, ...rest } = u;
    const created = await User.create(rest);
    userMap[id] = created._id;
  }

  for (const p of data.products || []) {
    const { id, ...rest } = p;
    const created = await Product.create(rest);
    productMap[p.id] = created._id;
  }

  const orderDocs = (data.orders || []).map((order) => ({
    userId: userMap[order.userId],
    items: order.items.map((item) => ({
      productId: productMap[item.productId],
      quantity: item.quantity,
      price: item.price,
    })),
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    total: order.total,
    deliveryDate: order.deliveryDate,
    orderDate: order.orderDate,
    status: order.status,
  }));
  await Order.insertMany(orderDocs);

  const reviewDocs = (data.reviews || []).map((review) => ({
    userId: userMap[review.userId],
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
  }));
  await Review.insertMany(reviewDocs);

  const favoriteDocs = (data.favorites || []).map((fav) => ({
    userId: userMap[fav.userId],
    productId: productMap[fav.productId],
  }));
  await Favorite.insertMany(favoriteDocs);

  const cartDocs = (data.carts || []).flatMap((cart) => (cart.items || []).map((item) => ({
    userId: userMap[cart.userId],
    productId: productMap[item.productId],
    quantity: item.quantity || 1,
    }))
  );
  await Cart.insertMany(cartDocs);

  console.log("✅ Migration complete!");
  mongoose.disconnect();
};

migrateData().catch((err) => {
  console.error("❌ Migration failed:", err);
  mongoose.disconnect();
});
