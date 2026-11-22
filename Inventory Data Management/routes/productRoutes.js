const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  adjustStock,
  deleteProduct,
  getLowStockProducts,
  getInventorySummary,
} = require("../controllers/productController");

const {
  validateObjectId,
  validateCreateProduct,
  validateStockChange,
} = require("../middleware/validate");

// Aggregation report routes (must come before /:id)
router.get("/low-stock", getLowStockProducts);
router.get("/summary", getInventorySummary);

// Collection routes
router.get("/", getAllProducts);
router.post("/", validateCreateProduct, createProduct);

// Single-item routes
router.get("/:id", validateObjectId, getProductById);
router.put("/:id", validateObjectId, updateProduct);
router.patch("/:id/stock", validateObjectId, validateStockChange, adjustStock);
router.delete("/:id", validateObjectId, deleteProduct);

module.exports = router;
