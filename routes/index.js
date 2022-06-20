const express = require("express");
const handler = require("../controllers/ProductController");
const {
  getUsers,
  getUserById,
  register,
  login,
  upload,
  whoami,
  updateProfile,
  logout,
} = require("../controllers/UserController");
const router = express.Router();

// Auth Router
router.get("/users", getUsers);
router.get("/user/:id", getUserById);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/whoami", whoami);
router.post("/profile/update", upload, updateProfile);

// Product Router
router.get("/products", handler.getAllProduct);
router.get("/products/:id", handler.getProduct);
router.post("/products", handler.createProduct);
router.put("/products/:id", handler.updateProduct);
router.delete("/products/:id", handler.deleteProduct);

module.exports = router;
