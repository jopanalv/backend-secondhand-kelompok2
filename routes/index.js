const express = require("express");
const handler = require("../controllers/ProductController");
const {
  getUsers,
  getUserById,
  register,
  login,
  whoami,
  updateProfile,
  logout,
  uploadProfileImages,
} = require("../controllers/UserController");
const {
  buyProduct,
  getNotifBuyer,
  getNotifSeller,
  getTransactionHistoryBuyer,
  getTransactionHistorySeller,
  detailTransaction,
  acceptTransaction,
  cancelTransaction,
  successTransaction,
} = require("../controllers/TransactionController");
const { authorize } = require("../middleware/Authorize");
const { verifyToken } = require("../middleware/verifyToken");
const { newToken } = require("../controllers/NewToken");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const passport = require("passport");

// handle storage using multer
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

let upload = multer({ storage: storage });

// Auth Router
router.get("/users", verifyToken, getUsers);
router.get("/user/:id", verifyToken, getUserById);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/logout", (req, res) => {
  req.logout();
  res.status(200).send("Logout Success");
});
router.get("/whoami", verifyToken, whoami);
router.put("/profile/update", verifyToken, uploadProfileImages, updateProfile);
router.get("/token", newToken);

//Auth Google
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/api/v1/login/success",
    failureRedirect: "/api/v1/login/failed/",
  }),
  (req, res) => {
    res.status(200).json({ success: "User logged in" });
  }
);

router.get("/login/success", (req, res) => {
  res.status(200).send("Login Berhasil!. Logout: GET /api/v1/logout");
});
router.get("/login/failed", (req, res) => {
  res.send(400).json("Something went wrong");
});

// Product Router
router.get("/products", handler.getAllProduct);
router.get("/products/:id", handler.getProduct);
router.get(
  "/seller/products",
  authorize(accessControl.SELLER),
  handler.getProductSeller
);
router.post(
  "/products",
  [authorize(accessControl.SELLER), upload.single("image")],
  handler.createProduct
);
router.put(
  "/products/:id",
  [authorize(accessControl.SELLER), upload.single("image")],
  handler.updateProduct
);
router.delete(
  "/products/:id",
  authorize(accessControl.SELLER),
  handler.deleteProduct
);

// Transaction router
router.get("/notif/buyer", authorize(accessControl.BUYER), getNotifBuyer);
router.get("/notif/seller", authorize(accessControl.SELLER), getNotifSeller);
router.get(
  "/transaction/buyer",
  authorize(accessControl.BUYER),
  getTransactionHistoryBuyer
);
router.get(
  "/transaction/seller",
  authorize(accessControl.SELLER),
  getTransactionHistorySeller
);
router.get(
  "/transaction/detail/:id",
  authorize(accessControl.SELLER),
  detailTransaction
);
router.post("/buy/:id", authorize(accessControl.BUYER), buyProduct);
router.put("/accept/:id", authorize(accessControl.SELLER), acceptTransaction);
router.put("/cancel/:id", authorize(accessControl.SELLER), cancelTransaction);
router.put("/success/:id", authorize(accessControl.SELLER), successTransaction);

module.exports = router;
