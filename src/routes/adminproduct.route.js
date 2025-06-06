const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');
const { authenticate } = require('../middleware/authenticate');

router.post('/', authenticate, productController.createProduct)
router.post('/creates', authenticate, productController.createMultipleProducts)
router.delete('/:id', authenticate, productController.deleteProduct)
router.put('/:id',authenticate,productController.updateProduct)
 
module.exports=router