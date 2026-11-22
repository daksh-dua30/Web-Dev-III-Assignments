const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();

// Built-in JSON body parser
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Inventory & Data Management API is running" });
});

// Product routes
app.use("/api/products", productRoutes);

// 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
