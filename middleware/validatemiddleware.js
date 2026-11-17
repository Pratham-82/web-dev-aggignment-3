const mongoose = require("mongoose");

const REQUIRED_FIELDS = [
  "name",
  "sku",
  "category",
  "price",
  "quantity",
  "reorderLevel",
  "supplier",
];
const STRING_FIELDS = ["name", "sku", "category", "supplier"];
const NUMBER_FIELDS = ["price", "quantity", "reorderLevel"];

const checkFields = (body, errors) => {
  STRING_FIELDS.forEach((f) => {
    if (
      body[f] !== undefined &&
      (typeof body[f] !== "string" || !body[f].trim())
    ) {
      errors.push(`${f} must be a non-empty string`);
    }
  });

  NUMBER_FIELDS.forEach((f) => {
    if (body[f] !== undefined) {
      if (typeof body[f] !== "number" || Number.isNaN(body[f]) || body[f] < 0) {
        errors.push(`${f} must be a number greater than or equal to 0`);
      }
    }
  });
};

// Validates a POST body: all fields required
const validateCreateProduct = (req, res, next) => {
  const errors = [];

  REQUIRED_FIELDS.forEach((f) => {
    if (
      req.body[f] === undefined ||
      req.body[f] === null ||
      req.body[f] === ""
    ) {
      errors.push(`${f} is required`);
    }
  });

  checkFields(req.body, errors);

  if (errors.length) {
    return res.status(400).json({ message: "Validation failed", errors });
  }
  next();
};

// Validates a PUT body: fields optional, but those present must be valid
const validateUpdateProduct = (req, res, next) => {
  const errors = [];

  if (!req.body || Object.keys(req.body).length === 0) {
    errors.push("Request body cannot be empty");
  }

  checkFields(req.body || {}, errors);

  if (errors.length) {
    return res.status(400).json({ message: "Validation failed", errors });
  }
  next();
};

// Validates PATCH /:id/stock body: { change: <non-zero integer> }
const validateStockChange = (req, res, next) => {
  const { change } = req.body;

  if (typeof change !== "number" || !Number.isInteger(change) || change === 0) {
    return res.status(400).json({
      message:
        "'change' must be a non-zero integer (positive to restock, negative for a sale)",
    });
  }
  next();
};

// Validates :id route param
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid Product ID" });
  }
  next();
};

module.exports = {
  validateCreateProduct,
  validateUpdateProduct,
  validateStockChange,
  validateObjectId,
};
