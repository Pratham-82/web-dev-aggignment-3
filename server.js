require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const productRoutes = require("./routes/productroutes");
const { notFound, errorHandler } = require("./middleware/errormiddleware");

const app = express();

app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Inventory Management API is Running");
});

// Product routes
app.use("/api/products", productRoutes);

// Must be registered after all routes
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
