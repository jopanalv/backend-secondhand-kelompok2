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
    res
      .status(200)
      .json({ message: "Success get all users", statusCode: 200, data: users });
  } catch (error) {
    return res.status(500).json({
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
    return res.status(500).json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ status: 400, message: "Data cannot be empty!" });
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
    return res.status(500).json({
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
      return res.status(404).json({
        message: "Email is not registered!",
        statusCode: 404,
      });
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(401).json({
        message: "Username or password do not match!",
        statusCode: 401,
      });
    }
    req.user = { id: user.id, email: user.email, role: user.role };
    signToken(req, res);
  } catch (error) {
    return res.status(500).json({
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
    return res
      .status(200)
      .json({ statusCode: 200, success: true, message: "Logout Successfully" });
  } catch (error) {
    return res.status(500).json({
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
    return res.status(500).json({
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
      return res.status(201).redirect("http://localhost:3000/");
    }
    if (!req.user.userId) {
      return res
        .status(403)
        .json({ status: 403, message: "Please login first!" })
        .redirect("/");
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
    res.status(200).json({
      message: "Update role Success!",
      statusCode: 200,
      data: updatedRole,
    });
  } catch (error) {
    return res.status(500).json({
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
