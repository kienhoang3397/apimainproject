const Product = require("../../models/Product");

const productController = {
  getAllProduct: async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  createProduct: async (req, res) => {
    try {
      const {
        image,
        image1,
        image2,
        image3,
        image4,
        name,
        desc1,
        desc2,
        price,
        stock,
        category,
      } = req.body;

      const newProduct = new Product({
        image,
        image1,
        image2,
        image3,
        image4,
        name,
        desc1,
        desc2,
        price,
        stock,
        category,
      });

      const product = await newProduct.save();
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  updateProduct: async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getSingleProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Delete success" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = productController;
