const express = require('express');
const handler = require('../controllers/ProductController');
const { getUsers, register, login, whoami } = require("../controllers/UserController");
const router = express.Router();

// Auth Router
router.get('/users', getUsers)
router.get('/users/:id', whoami)
router.post('/register', register)
router.post('/login', login)

// Product Router
router.get('/products', handler.getAllProduct)
router.get('/products/:id', handler.getProduct)
router.post('/products', handler.createProduct)
router.put('/products/:id', handler.updateProduct)
router.delete('/products/:id', handler.deleteProduct)

module.exports = router;
