const mongoose = require("mongoose");

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid product ID format" });
  }
  next();
};

const validateCreateProduct = (req, res, next) => {
  const { name, sku, category, price, quantity } = req.body;
  const missing = [];

  if (!name) missing.push("name");
  if (!sku) missing.push("sku");
  if (!category) missing.push("category");
  if (price === undefined) missing.push("price");
  if (quantity === undefined) missing.push("quantity");

  if (missing.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      missingFields: missing,
    });
  }

  next();
};

const validateStockChange = (req, res, next) => {
  const { change } = req.body;

  if (typeof change !== "number" || Number.isNaN(change) || change === 0) {
    return res.status(400).json({
      error:
        'Field "change" must be a non-zero number (positive to restock, negative for sale)',
    });
  }

  next();
};

module.exports = {
  validateObjectId,
  validateCreateProduct,
  validateStockChange,
};
