const productController = require("../controllers/ProductControllers/productController");



const router = require("express").Router();

router.post("/add", productController.createProduct);

router.get("/getall",  productController.getAllProduct)
router.get("/:id",  productController.getSingleProduct)
router.delete('/:id', productController.deleteProduct);

router.put("/:id",productController.updateProduct)

module.exports = router