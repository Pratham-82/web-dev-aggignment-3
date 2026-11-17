const Product = require("../models/product");

const SORTABLE_FIELDS = [
  "name",
  "sku",
  "category",
  "price",
  "quantity",
  "createdAt",
  "updatedAt",
];

// POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const { name, sku, category, price, quantity, reorderLevel, supplier } =
      req.body;

    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res
        .status(409)
        .json({ message: "Product with this SKU already exists" });
    }

    const product = await Product.create({
      name,
      sku,
      category,
      price,
      quantity,
      reorderLevel,
      supplier,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// GET /api/products?category=&minPrice=&maxPrice=&sortBy=&order=&page=&limit=
const getAllProducts = async (req, res, next) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      sortBy,
      order,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    const sort = {};
    if (sortBy && SORTABLE_FIELDS.includes(sortBy)) {
      sort[sortBy] = order === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    const currentPage = Math.max(1, parseInt(page) || 1);
    const perPage = Math.max(1, parseInt(limit) || 10);
    const skip = (currentPage - 1) * perPage;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(perPage),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      total,
      page: currentPage,
      totalPages: Math.ceil(total / perPage),
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id  (update product details)
const updateProduct = async (req, res, next) => {
  try {
    const allowed = [
      "name",
      "sku",
      "category",
      "price",
      "quantity",
      "reorderLevel",
      "supplier",
    ];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    // If SKU is being changed, make sure it isn't taken by another product
    if (updates.sku) {
      const clash = await Product.findOne({
        sku: updates.sku,
        _id: { $ne: req.params.id },
      });
      if (clash) {
        return res
          .status(409)
          .json({ message: "Product with this SKU already exists" });
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/products/:id/stock  body: { "change": 10 } (restock) or { "change": -3 } (sale)
const adjustStock = async (req, res, next) => {
  try {
    const { change } = req.body;

    // Atomic: only applies if the result won't go below zero
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, quantity: { $gte: -change } },
      { $inc: { quantity: change } },
      { new: true, runValidators: true },
    );

    if (!product) {
      const exists = await Product.exists({ _id: req.params.id });
      if (!exists) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res
        .status(400)
        .json({ message: "Insufficient stock for this sale" });
    }

    res.status(200).json({ message: "Stock updated", product });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted", id: product._id });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/low-stock  (quantity <= reorderLevel)
const getLowStockProducts = async (req, res, next) => {
  try {
    const docs = await Product.aggregate([
      { $match: { $expr: { $lte: ["$quantity", "$reorderLevel"] } } },
      { $sort: { quantity: 1 } },
    ]);

    // Hydrate so the stockValue virtual appears in the JSON output
    const lowStockItems = docs.map((doc) => Product.hydrate(doc));

    res.status(200).json({ count: lowStockItems.length, lowStockItems });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/summary  (category-wise inventory summary)
const getCategorySummary = async (req, res, next) => {
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
      { $sort: { totalStockValue: -1 } },
    ]);

    res.status(200).json({ categories: summary.length, summary });
  } catch (error) {
    next(error);
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
  getCategorySummary,
};
