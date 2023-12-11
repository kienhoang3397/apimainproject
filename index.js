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
  .connect('mongodb+srv://kien2023:30122004@cluster0.nme04sd.mongodb.net/test?retryWrites=true&w=majority')
  .then(() => {
    console.log("Connected to MongoDB");

    app.get("/", (req, res) => {
      res.send("MongoDB is connected!");
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
