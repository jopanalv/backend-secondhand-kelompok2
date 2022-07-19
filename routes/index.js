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
<<<<<<< HEAD
  updateRole,
=======
>>>>>>> 3fb2bad0b10e6a2e85ccf44c9d59597c89a53ac7
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
const { signToken, verifyRole } = require("../services/authService");
const { newToken } = require("../services/authService");
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
    let filename = file.originalname;
    req.body.file = filename;
    cb(null, filename);
  },
});

let upload = multer({ 
  storage: storage,
  limits: { fileSize: "10000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("File format not allowed!");
  }, 
});

// Auth Router
router.get("/users", verifyToken, getUsers);
router.get("/user/:id", verifyToken, getUserById);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

//GET LOGOUT ONLY FOR LOGOUT WITHOUT FORM
router.get("/logout", (req, res) => {
  req.logout();
  res.status(200).send("Logout Success");
});

router.get("/whoami", verifyToken, whoami);
router.put(
  "/profile/update",
  [verifyToken, upload.single("image")],
  updateProfile
);
router.get("/token", newToken);

//Auth Google
router.get(
  "/auth/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    signToken(req, res);
  }
);
router.get("/auth/google/googleAccessToken", (req, res) => {
  verifyRole(req, res);
});
router.put("/profile/role", verifyToken, updateRole);

// Product Router
router.get("/products", handler.getAllProduct);
router.get("/products/:id", handler.getProduct);
router.get("/category/list", handler.getListCategories);
router.get(
  "/seller/products",
  authorize(accessControl.SELLER),
  handler.getProductSeller
);
router.get(
  "/buyer/wishlist/list",
  authorize(accessControl.BUYER),
  handler.getWishlist
);
router.get(
  "/seller/wishlist/list",
  authorize(accessControl.SELLER),
  handler.getWishlistedProduct
);
router.post(
  "/products",
  [authorize(accessControl.SELLER), upload.single("image")],
  handler.createProduct
);
router.post(
  "/products/wishlist/:id",
  authorize(accessControl.BUYER),
  handler.addWishlist
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
