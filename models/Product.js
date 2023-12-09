const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
      max: 50,
    },
    image1: {
      type: String,
      required: true,
      max: 50,
    },
    image2: {
      type: String,
      required: true,
      max: 50,
    },
    image3: {
      type: String,
      required: true,
      max: 50,
    },
    image4: {
      type: String,
      required: true,
      max: 50,
    },

    name: {
      type: String,
      required: true,
      min: 6,
    },
    desc1: {
      type: String,
    },
    desc2: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", userSchema);
