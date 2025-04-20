const express = require('express');
const router = express.Router();

const cartItemCotroller = require("../controllers/cartItem.controller");
const { authenticate } = require('../middleware/authenticate');

router.put("/:id", authenticate, cartItemCotroller.updateCartItem)
router.delete("/:id",authenticate,cartItemCotroller.removeCartItem)

module.exports = router
