const express = require("express");
const { getUsers, register, login } = require("../controllers/UserController");

const router = express.Router();

router.get("/api/v1/users", getUsers);
router.post("/api/v1/register", register);
router.post("/api/v1/login", login);

module.exports = router;
