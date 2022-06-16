const express = require('express');
const handler = require('../controllers/ProductController');
const router = express.Router();

// Product Router
router.get('/products', handler.getAllProduct)
router.get('/products/:id', handler.getProduct)
router.post('/products', handler.createProduct)
router.put('/products/:id', handler.updateProduct)
router.delete('/products/:id', handler.deleteProduct)

module.exports = router;
