const models = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = models.Users;

const getUsers = async (req, res) => {
  try {
    const Users = await users.findAll();
    res.json(Users);
  } catch (error) {
    console.log(error);
  }
};
const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await users.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
    });
    res.json({ msg: "Register Success!" });
  } catch (error) {
    console.log(error);
  }
};
const login = async (req, res) => {
  try {
    const User = await users.findAll({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, User[0].password);
    if (!match) {
      console.log("Password didn't match");
      return res
        .status(400)
        .json({ msg: "Username or Password didn't match!" });
    }
    const userId = User[0].id;
    const email = User[0].email;
    const role = User[0].role;
    const accessToken = jwt.sign(
      { userId, email, role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = jwt.sign(
      { userId, email, role },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "30d",
      }
    );
    await users.update(
      { token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 30 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "Username or Password didn't match!" });
  }
};

module.exports = { getUsers, register, login };
