import express from 'express';
import cors from 'cors';
import user from './routes/users.mjs';
import order from './routes/orders.mjs';
import favorites from './routes/favorites.mjs';
import cart from './routes/carts.mjs';
import product from './routes/products.mjs';
import reviews from './routes/reviews.mjs';
import multer from 'multer';
import { loadData, saveDataToFile } from "./controllers/userController.mjs";

import { fileURLToPath } from "url";
import { dirname, join } from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors({
  origin: "https://certisfy.netlify.app",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options("*", cors());

app.use((req, res, next) => {
  res.on('finish', () => {
    console.log('Response headers:', res.getHeaders());
  });
  next();
});

app.use(express.json());
app.use('/uploads', express.static(join(__dirname,'../uploads')));

const upload = multer({ dest: join(__dirname, '../uploads') });

// Debug middleware to log the request object before multer
const logRequest = (req, res, next) => {
  console.log('Request before multer:', {
    method: req.method,
    url: req.url,
    params: req.params,
  });
  next();
};

app.use('/api/users', user);
app.use('/api/orders', order);
app.use('/api/carts', cart);
app.use('/api/products', product);
app.use('/api/favorites', favorites);
app.use('/api/reviews', reviews);

app.post("/api/users/:id/upload-photo", logRequest, upload.single("photo"), async (req, res, next) => {
  console.log(`POST /api/users/${req.params.id}/upload-photo received`);
  if (!req.file) {
    return res.status(400).json({ message: "No photo uploaded" });
  }
  const { id } = req.params;

  try {
    const data = await loadData();

    if (!data.users) throw new Error("data.users is undefined");

    const userIndex = data.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    const photoUrl = `/uploads/${req.file.filename}`; // ✅ fixed string

    data.users[userIndex].photoUrl = photoUrl;

    await saveDataToFile(data); // ✅ write updated data back to disk

    res.json(data.users[userIndex]); // ✅ respond with updated user
  } catch (err) {
    next(err);
  }
});


// Multer error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer error:", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(400).json({ message: "File upload error", error: err.message || "Unknown error" });
  }
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", {
    message: err.message || "Unknown error",
    stack: err.stack || "No stack trace",
    name: err.name || "Unknown",
  });
  res.status(500).json({
    message: "Internal server error",
    error: err.message || "Unknown error",
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});