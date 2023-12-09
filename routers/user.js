const userController = require("../controllers/userController");
const middleWareController = require("../controllers/middleWareController");

const router = require("express").Router();

//get all users
router.get("/", userController.getAllUser);

//delete user
router.delete(
  "/:id",
  middleWareController.verifyTokenAndUserAuthorization,
  userController.deleteUser
);

router.get("/info", middleWareController.verifyToken, userController.getUser);
// router.post('/addcart', middleWareController.auth, userController.addCart)

router.put("/:id", userController.updateUser);
router.post(
  "/add-to-cart",
  middleWareController.verifyToken,
  userController.addToCart
);
router.post(
  "/removeFromCart",
  middleWareController.verifyToken,
  userController.removeFromCart
);
router.post(
  "/decrease",
  middleWareController.verifyToken,
  userController.decreaseQuantity
);
router.post(
  "/add-to-wishlist",
  middleWareController.verifyToken,
  userController.addToWishlist
);
router.post(
  "/removeFromWishList",
  middleWareController.verifyToken,
  userController.removeFromWishlist
);
router.post("/checkout",
  middleWareController.verifyToken, userController.clearCart
);
router.post(
  "/add-to-orderhistory",
  middleWareController.verifyToken,
  userController.addCartToOrderHistory
);

module.exports = router;
