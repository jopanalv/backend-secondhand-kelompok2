const express = require('express');
const handler = require('../controllers/ProductController');
const { getUsers, register, login } = require("../controllers/UserController");
const router = express.Router();

// Auth Router
router.get("/api/v1/users", getUsers)
router.post("/api/v1/register", register)
router.post("/api/v1/login", login)

// Product Router
router.get('/products', handler.getAllProduct)
router.get('/products/:id', handler.getProduct)
router.post('/products', handler.createProduct)
router.put('/products/:id', handler.updateProduct)
router.delete('/products/:id', handler.deleteProduct)

module.exports = router;
