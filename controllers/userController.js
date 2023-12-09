const User = require("../models/User");
const Product = require("../models/Product");

const userController = {
  getAllUser: async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json("Delete sucsses");
    } catch (err) {
      res.status(500).json("Khong dc");
    }
  },
  updateUser: async (req, res) => {
    try {
      const updatedUser = await User.updateOne(
        { _id: req.params.id },
        { $set: req.body }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User does not exits" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  addToCart: async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user ? req.user.id : null;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Find the product by ID
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const existingProductIndex = user.cart.findIndex(
        (item) =>
          item.product && item.product.toString() === productId.toString()
      );

      if (existingProductIndex !== -1) {
        user.cart[existingProductIndex].quantity += quantity;
        user.cart[existingProductIndex].amount =
          user.cart[existingProductIndex].quantity *
          user.cart[existingProductIndex].price;
      } else {
        user.cart.push({
          product: productId,
          quantity,

          price: product.price,
          amount: product.price * quantity,
          image: product.image,
          name: product.name,
        });
      }

      user.totalAmount = user.cart.reduce(
        (total, item) => total + item.amount,
        0
      );

      await user.save();

      // Respond with success message and updated user
      res.json({ message: "Product added to the cart successfully.", user });
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  removeFromCart: async (req, res) => {
    const { productId } = req.body;
    const userId = req.user ? req.user.id : null;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const existingProductIndex = user.cart.findIndex(
        (item) =>
          item.product && item.product.toString() === productId.toString()
      );

      if (existingProductIndex !== -1) {
        user.cart.splice(existingProductIndex, 1);

        user.totalAmount = user.cart.reduce(
          (total, item) => total + item.amount,
          0
        );

        await user.save();

        return res.json({
          message: "Product removed from the cart successfully.",
          user,
        });
      }

      return res.status(404).json({ error: "Product not found in the cart" });
    } catch (error) {
      console.error("Error removing product from cart:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  decreaseQuantity: async (req, res) => {
    const { productId } = req.body;
    const userId = req.user ? req.user.id : null;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const existingProductIndex = user.cart.findIndex(
        (item) =>
          item.product && item.product.toString() === productId.toString()
      );

      if (existingProductIndex !== -1) {
        if (user.cart[existingProductIndex].quantity > 0) {
          user.cart[existingProductIndex].quantity -= 1;

          user.cart[existingProductIndex].amount =
            user.cart[existingProductIndex].quantity *
            user.cart[existingProductIndex].price;

          user.totalAmount = user.cart.reduce(
            (total, item) => total + item.amount,
            0
          );

          await user.save();

          return res.json({
            message: "Product quantity decreased in the cart successfully.",
            user,
          });
        } else {
          return res
            .status(400)
            .json({ error: "Product quantity is already zero" });
        }
      }

      return res.status(404).json({ error: "Product not found in the cart" });
    } catch (error) {
      console.error(
        "Error decreasing product quantity in cart:",
        error.message
      );
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  addToWishlist: async (req, res) => {
    const { productId } = req.body;
    const userId = req.user ? req.user.id : null;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const existingProductIndex = user.wishlist.findIndex(
        (item) =>
          item.product && item.product.toString() === productId.toString()
      );

      if (existingProductIndex !== -1) {
        return res
          .status(400)
          .json({ error: "Product already exists in the wishlist" });
      } else {
        user.wishlist.push({
          product: productId,
          image: product.image,
          name: product.name,
          price: product.price,
          stock: product.stock,
        });
      }

      await user.save();

      res.json({
        message: "Product added to the wishlist successfully.",
        user,
      });
    } catch (error) {
      console.error("Error adding product to wishlist:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  removeFromWishlist: async (req, res) => {
    const { productId } = req.body;
    const userId = req.user ? req.user.id : null;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const existingProductIndex = user.wishlist.findIndex(
        (item) =>
          item.product && item.product.toString() === productId.toString()
      );

      if (existingProductIndex !== -1) {
        user.wishlist.splice(existingProductIndex, 1);

        await user.save();

        return res.json({
          message: "Product removed from the wishlist successfully.",
          user,
        });
      }

      return res
        .status(404)
        .json({ error: "Product not found in the wishlist" });
    } catch (error) {
      console.error("Error removing product from wishlist:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  clearCart: async (req, res) => {
    const userId = req.user ? req.user.id : null;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await user.save();

      return res.json({ message: "Cart cleared successfully.", user });
    } catch (error) {
      console.error("Error clearing cart:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  addCartToOrderHistory: async (req, res) => {
    const userId = req.user ? req.user.id : null;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const orderHistoryEntries = user.cart.map((cartItem) => ({
        products: [
          {
            product: cartItem.product,
            quantity: cartItem.quantity,
            price: cartItem.price,
            amount: cartItem.amount,
            image: cartItem.image,
            name: cartItem.name,
          },
        ],

        date: new Date(),
      }));

      user.orderhistory = user.orderhistory.concat(orderHistoryEntries);

      user.cart = [];

      await user.save();

      return res.json({
        message: "Cart added to OrderHistory successfully.",
        orderHistoryEntries,
      });
    } catch (error) {
      console.error("Error adding cart to OrderHistory:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = userController;
