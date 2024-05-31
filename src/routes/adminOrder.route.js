const express = require('express');
const router = express.Router();

const orderController = require("../controllers/adminOrder.controller");
const { authenticate } = require('../middleware/authenticate');

router.get("/", authenticate, orderController.getAllOrders)
router.put("/:orderId/confirmed", authenticate, orderController.confirmOrders)
router.put("/:orderId/ship", authenticate,orderController.shippOrders)
router.put("/:orderId/deliver", authenticate,orderController.deliverOrders)
router.put("/:orderId/cancel", authenticate,orderController.cancelOrders)
router.put("/:orderId/delete", authenticate,orderController.deleteOrders)


module.exports=router