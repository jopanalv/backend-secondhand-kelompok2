const { Users, Profiles } = require("../models");
const bcrypt = require("bcrypt");
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
    res.status(200);
    return res.json({
      message: "Success get all users",
      statusCode: 200,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
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
        attributes: ["image", "city", "name", "address", "no_hp"],
      },
      where: {
        id: userId,
      },
    });
    if (!users) {
      res.status(404);
      return res.json({
        message: "User does not exist",
        statusCode: 404,
      });
    } else {
      res.status(200);
      return res.json({
        message: "Success get user",
        statusCode: 200,
        data: users,
      });
    }
  } catch (error) {
    res.status(500);
    return res.json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    res.status(400);
    return res.json({ status: 400, message: "Data cannot be empty!" });
  }
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    const isEmailRegistered = await Users.findOne({
      where: {
        email: email,
      },
    });
    if (isEmailRegistered) {
      res.status(409);
      return res.json({
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
    res.status(201);
    return res.json({
      message: "Register success!",
      statusCode: 201,
      data: user,
    });
  } catch (error) {
    res.status(500);
    return res.json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const login = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      res.status(404);
      return res.json({
        message: "Email is not registered!",
        statusCode: 404,
      });
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      res.status(401);
      return res.json({
        message: "Username or password do not match!",
        statusCode: 401,
      });
    }
    req.user = { id: user.id, email: user.email, role: user.role };
    signToken(req, res);
  } catch (error) {
    res.status(500);
    return res.json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const whoami = async (req, res) => {
  try {
    checkToken(req, res);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    if (!refreshToken) {
      return res.sendStatus(204);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    req.logout();
    res.status(200);
    return res.json({
      statusCode: 200,
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    res.status(500);
    return res.json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const updateProfile = async (req, res) => {
  const { name, city, address, no_hp } = req.body;
  const image = req.body.file;
  try {
    if (!req.user.userId) {
      res.status(403);
      return res.json({
        message: "Cannot update profile!",
        statusCode: 403,
      });
    }
    if (!name || !city || !address || !no_hp) {
      res.status(400);
      return res.json({
        status: 400,
        message: "Please fill in each input field!",
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
    res.status(200);
    return res.json({
      message: "Update profile Success!",
      statusCode: 200,
      data: afterUpdate,
    });
  } catch (error) {
    res.status(500);
    return res.json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const updateRole = async (req, res) => {
  const { role } = req.body;
  try {
    if (req.user.role != null) {
      res.status(403);
      return res.json({ status: 403, message: "You already have role!" });
    }
    if (!req.user.userId) {
      res.status(403);
      return res.json({ status: 403, message: "Please login first!" });
    }
    await Users.update(
      { role },
      {
        where: {
          UserId: req.user.userId,
        },
      }
    );
    const updatedRole = await Users.findOne({
      where: { UserId: req.user.userId },
    });
    res.status(200);
    return res.json({
      message: "Update role Success!",
      statusCode: 200,
      data: updatedRole,
    });
  } catch (error) {
    res.status(500);
    return res.json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  register,
  login,
  whoami,
  updateProfile,
  updateRole,
  logout,
};
