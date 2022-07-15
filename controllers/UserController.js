const { Users, Profiles } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { checkToken, signToken } = require("../services/authService");

const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "email", "role"],
      include: {
        model: Profiles,
        required: true,
        attributes: ["image", "name", "address", "no_hp"],
      },
    });
    res
      .status(200)
      .json({ message: "Success get all users", statusCode: 200, data: users });
  } catch (error) {
    console.log(error);
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const users = await Users.findOne({
      attributes: ["id", "email", "role"],
      include: {
        model: Profiles,
        required: true,
        attributes: ["image", "name", "address", "no_hp", "city"],
      },
      where: {
        id: userId,
      },
    });
    if (!users) {
      res.status(404).json({
        message: "User does not exist",
        statusCode: 404,
      });
    } else {
      res.status(200).json({
        message: "Success get user",
        statusCode: 200,
        data: users,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    const isEmailRegistered = await Users.findOne({
      where: {
        email: email,
      },
    });
    if (isEmailRegistered) {
      return res.status(409).json({
        status: 409,
        message: "Email already exist!",
      });
    }
    const user = await Users.create({
      email: email,
      password: hashPassword,
      role: role,
    });
    await Profiles.create({
      UserId: user.id,
      name: name,
    });
    res.status(201).json({
      message: "Register success!",
      statusCode: 201,
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(403).json({
        message: "Username or password do not match!",
        statusCode: 403,
      });
    }
    req.user = { id: user.id, email: user.email, role: user.role };
    signToken(req, res);
  } catch (error) {
    console.log(error);
  }
};

const whoami = async (req, res) => {
  try {
    checkToken(req, res);
  } catch (error) {
    console.log(error);
  }
};

const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    if (!refreshToken) {
      return res.sendStatus(204);
    }
    res.clearCookie("refreshToken");
    return res
      .status(200)
      .json({ statusCode: 200, success: true, message: "Logout Successfully" });
  } catch (error) {
    console.log(error);
  }
};

const updateProfile = async (req, res) => {
  const { name, city, address, no_hp } = req.body;
  const image = req.body.file;
  console.log(image)
  try {
    if (!req.user.userId) {
      return res.status(403).json({
        message: "Cannot update profile!",
        statusCode: 403,
      });
    }

    await Profiles.update(
      { image, name, city, address, no_hp },
      {
        where: {
          UserId: req.user.userId,
        },
      }
    );
    const afterUpdate = await Profiles.findOne({
      attributes: ["image", "name", "address", "no_hp"],
      where: {
        UserId: req.user.userId,
      },
    });
    res.status(200).json({
      message: "Update profile Success!",
      statusCode: 200,
      data: afterUpdate,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getUsers,
  getUserById,
  register,
  login,
  whoami,
  updateProfile,
  logout,
};
