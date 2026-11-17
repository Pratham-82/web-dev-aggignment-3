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
  getCategorySummary,
} = require("../controllers/productcontroller");

const {
  validateCreateProduct,
  validateUpdateProduct,
  validateStockChange,
  validateObjectId,
} = require("../middleware/validatemiddleware");

// Static routes MUST come before "/:id", otherwise "low-stock" and
// "summary" would be treated as product IDs.
router.get("/low-stock", getLowStockProducts);
router.get("/summary", getCategorySummary);

router.post("/", validateCreateProduct, createProduct);
router.get("/", getAllProducts);

router.get("/:id", validateObjectId, getProductById);
router.put("/:id", validateObjectId, validateUpdateProduct, updateProduct);
router.patch("/:id/stock", validateObjectId, validateStockChange, adjustStock);
router.delete("/:id", validateObjectId, deleteProduct);

module.exports = router;
