
const authController = require("../controllers/authController");
const middleWareController = require("../controllers/middleWareController")


const router = require("express").Router();
// REGISTER
router.post("/register", authController.registerUser);

// LOGIN
router.post("/login", authController.loginUser);

// REFRESH TOKEN
router.post("/refresh", authController.requestRefreshToken);

router.post("/logout", middleWareController.verifyToken, authController.userLogout)

module.exports = router;
