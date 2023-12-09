const User = require("../models/User");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const authController = {
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "365d" }
    );
  },
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "365d" }
    );
  },

  // REGISTER
  registerUser: async (req, res) => {
    try {
      // Create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password, 
        phonenumber: req.body.phonenumber
      });

      // Save user to DB
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
  
      if (!user) {
        return res.status(404).json("Wrong Username or Password!");
      }
  
      if (req.body.password !== user.password) {
        return res.status(404).json("Wrong Username or Password!");
      }
  
      const accessToken = authController.generateAccessToken(user);
      const refreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(refreshToken);
  
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });
  
      // Include accessToken and a success message in the response
      res.status(200).json({ user, accessToken, message: "Login successful. Refresh token set." });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  
  requestRefreshToken: async (req, res) => {
   
    const refreshToken = req.cookies.refreshToken;

    // Send error if token is not valid
    if (!refreshToken) return res.status(401).json("You're not aaaaauthenticated");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }

      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      // Create new access token, refresh token and send to user
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);

      // Use newRefreshToken here, not refreshToken
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });

      res.status(200).json({
        accessToken: newAccessToken

      });
    });
  },
  userLogout: async (req, res) =>{
    res.clearCookie("refreshToken")
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    )
    res.status(200).json("Loggout !")
  }
};

module.exports = authController;
