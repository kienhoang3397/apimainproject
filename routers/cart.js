// const express = require('express');
// const router = express.Router();
// const { auth } = require('../controllers/middleWareController');
// const Cart = require('../models/Cart');
// const Product = require('../models/Product');

// const populate = {
//   path: 'cartDetail',
//   populate: {
//     path: '_product',
//     model: 'products',
//   },
// };

// router.post('/addtocart', auth, async (req, res) => {
//   try {
//     const customerCart = await Cart.findOne({ _customerId: req._customerId });
//     const product = await Product.findById(req.body._productId);

//     const cartDetails = {
//       _product: req.body._productId,
//       quantity: req.body.quantity,
//       price: product.price,
//       amount: product.price * req.body.quantity,
//     };

//     if (customerCart) {
//       const updatedCart = await Cart.findOneAndUpdate(
//         {
//           _customerId: req._customerId,
//           'cartDetails._product': req.body._productId,
//         },
//         {
//           $inc: {
//             'cartDetails.$.quantity': req.body.quantity,
//             'cartDetails.$.amount': product.price * req.body.quantity,
//           },
//         },
//         { new: true }
//       ).populate(populate);

//       if (updatedCart) {
//         return res.status(200).json({ status: 'success', message: 'Add success', data: updatedCart });
//       } else {
//         const newCart = await Cart.findOneAndUpdate(
//           { _customerId: req._customerId },
//           {
//             $push: {
//               cartDetails: { ...cartDetails },
//             },
//           },
//           { new: true }
//         ).populate(populate);

//         return res.status(200).json({ status: 'success', message: 'Add success', data: newCart });
//       }
//     } else {
//       const newCart = new Cart({
//         _customerId: req._customerId,
//         cartDetails: [cartDetails],
//       });
//       const savedCart = await newCart.save();

//       return res.status(200).json({ status: 'success', message: 'Add success', data: savedCart });
//     }
//   } catch (error) {
//     console.error('Error:', error.message);
//     res.status(500).json({ status: 'error', error: error.message });
//   }
// });

// router.get('/', auth, async (req, res) => {
//   try {
//     const customerCart = await Cart.findOne({ _customerId: req._customerId }).populate(populate);

//     if (!customerCart) {
//       return res.status(404).json({ status: 'not_found', message: 'Cart not found' });
//     }

//     return res.status(200).json({ status: 'success', message: 'Get customer cart success', data: customerCart });
//   } catch (error) {
//     console.error('Error:', error.message);
//     res.status(500).json({ status: 'error', error: error.message });
//   }
// });

// module.exports = router;
