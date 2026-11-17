// 404 handler for unknown routes
const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

// Centralized error handler
const errorHandler = (err, req, res, next) => {
  // Mongoose schema validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Invalid ObjectId or bad type cast
  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ message: `Invalid ${err.path}: ${err.value}` });
  }

  // Duplicate key (unique index, e.g. SKU)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({ message: `Duplicate value for ${field}` });
  }

  // Malformed JSON body
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON in request body" });
  }

  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
};

module.exports = { notFound, errorHandler };
