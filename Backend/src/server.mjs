import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import user from './routes/users.mjs';
import order from './routes/orders.mjs';
import favorites from './routes/favorites.mjs';
import cart from './routes/carts.mjs';
import product from './routes/products.mjs';
import reviews from './routes/reviews.mjs';
import multer from 'multer';
import fs from 'fs/promises';

import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();
const mongoURI = process.env.MONGO_URI

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadsDir = process.env.NODE_ENV === 'production' ? '/tmp/uploads' : join(__dirname, '../uploads');
await fs.mkdir(uploadsDir, { recursive: true });
console.log('Uploads directory ready at:', uploadsDir);

const app = express();

app.use(cors({
  origin: "https://certisfy.netlify.app",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options("*", cors());

app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Debug middleware to log the request object before multer
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  next();
});

const upload = multer({ dest: uploadsDir });

const logRequest = (req, res, next) => {
  console.log('Request before multer:', {
    method: req.method,
    url: req.url,
    params: req.params,
    body: req.body,
  });
  next();
};

app.use((req, res, next) => {
  res.on('finish', () => {
    console.log('Response headers:', res.getHeaders());
  });
  next();
});

app.use('/api/users', user);
app.use('/api/orders', order);
app.use('/api/carts', cart);
app.use('/api/products', product);
app.use('/api/favorites', favorites);
app.use('/api/reviews', reviews);

// Multer error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer error:", {
      message: err.message,
      stack: err.stack,
    });
    if (!res.headersSent) {
      return res.status(400).json({ message: "File upload error", error: err.message || "Unknown error" });
    }
    return; 
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