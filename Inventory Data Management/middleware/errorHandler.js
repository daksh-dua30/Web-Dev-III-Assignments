const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: "Validation failed",
      details,
    });
  }

  // MongoDB Duplicate Key Error (e.g., duplicate SKU)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      error: `Duplicate value for field "${field}": ${err.keyValue[field]}`,
    });
  }

  // Invalid ObjectId CastError
  if (err.name === "CastError") {
    return res.status(400).json({
      error: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Fallback Server Error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
  });
};

module.exports = { notFoundHandler, errorHandler };
