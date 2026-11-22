const Product = require("../models/Product");

// Helper to escape special regex characters in user search strings
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @desc    Create a new product
// @route   POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all products with filtering, sorting & pagination
// @route   GET /api/products
const getAllProducts = async (req, res, next) => {
  try {
    const {
      category,
      supplier,
      search,
      minPrice,
      maxPrice,
      sort = "-createdAt",
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (category) {
      filter.category = { $regex: `^${escapeRegex(category)}$`, $options: "i" };
    }

    if (supplier) {
      filter.supplier = { $regex: escapeRegex(supplier), $options: "i" };
    }

    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ name: regex }, { sku: regex }];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined && !Number.isNaN(Number(minPrice))) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && !Number.isNaN(Number(maxPrice))) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Allow comma-separated sort fields, e.g. ?sort=-price,name
    const sortBy = sort.split(",").join(" ");

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortBy).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      count: products.length,
      products,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

// @desc    Update product details
// @route   PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

// @desc    Safely increment (restock) or decrement (sale) stock quantity
// @route   PATCH /api/products/:id/stock
const adjustStock = async (req, res, next) => {
  try {
    const { change } = req.body;
    const { id } = req.params;

    if (change < 0) {
      // Atomic check prevents stock from dropping below 0 under concurrent requests
      const updated = await Product.findOneAndUpdate(
        { _id: id, quantity: { $gte: Math.abs(change) } },
        { $inc: { quantity: change } },
        { new: true, runValidators: true },
      );

      if (!updated) {
        const exists = await Product.exists({ _id: id });
        if (!exists) {
          return res.status(404).json({ error: "Product not found" });
        }
        return res.status(400).json({
          error: "Insufficient stock: quantity cannot drop below 0",
        });
      }

      return res.status(200).json({
        message: "Stock updated",
        product: updated,
      });
    }

    // Positive change (restock)
    const updated = await Product.findByIdAndUpdate(
      id,
      { $inc: { quantity: change } },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: "Stock updated",
      product: updated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a product by ID
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted",
      id: product._id,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Low-stock alert report (quantity <= reorderLevel) using aggregation
// @route   GET /api/products/low-stock
const getLowStockProducts = async (req, res, next) => {
  try {
    const lowStockItems = await Product.aggregate([
      {
        $match: {
          $expr: { $lte: ["$quantity", "$reorderLevel"] },
        },
      },
      {
        $addFields: {
          stockValue: { $round: [{ $multiply: ["$price", "$quantity"] }, 2] },
          id: { $toString: "$_id" },
        },
      },
      { $sort: { quantity: 1 } },
    ]);

    res.status(200).json({
      count: lowStockItems.length,
      lowStockItems,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Category-wise inventory summary using aggregation pipeline
// @route   GET /api/products/summary
const getInventorySummary = async (req, res, next) => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalStockValue: { $sum: { $multiply: ["$price", "$quantity"] } },
          avgPrice: { $avg: "$price" },
        },
      },
      {
        $project: {
          _id: 1,
          totalItems: 1,
          totalQuantity: 1,
          totalStockValue: { $round: ["$totalStockValue", 2] },
          avgPrice: { $round: ["$avgPrice", 2] },
        },
      },
      { $sort: { totalStockValue: -1 } },
    ]);

    res.status(200).json({
      categories: summary.length,
      summary,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  adjustStock,
  deleteProduct,
  getLowStockProducts,
  getInventorySummary,
};
