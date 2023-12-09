const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routers/auth");
const userRoute = require("./routers/user");
const productRoute = require("./routers/product");

dotenv.config();
const app = express();
mongoose
  .connect(process.env.MONGODB_PRODUCT)
  .then(() => {
    console.log("Connected to MongoDB");
    // If connected successfully, you can send a response here
    app.get("/", (req, res) => {
      res.send("Hello, this is your server and MongoDB is connected!");
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });


app.use(cors());
app.use(cookieParser());
app.use(express.json());

// ROUTES
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);
app.use("/product", productRoute);

// Route for the root path
app.get("/", (req, res) => {
  res.send("Hello, this is your server!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
