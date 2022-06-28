const { Users, Profiles } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

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
        attributes: ["image", "name", "address", "no_hp"],
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
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) {
      return res.status(403).json({
        message: "Username or password do not match!",
        statusCode: 403,
      });
    }
    const userId = user[0].id;
    const email = user[0].email;
    const role = user[0].role;
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
    await Users.update(
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
    res.status(302).json({
      message: "Login success!",
      statusCode: 302,
      accessToken: accessToken,
    });
  } catch (error) {
    console.log(error);
  }
};

// To fixed: who am i
const whoami = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    if (!refreshToken) {
      res.status(204).json({ msg: "Please Login First!", statusCode: 204 });
    } else {
      const user = await Users.findOne({
        include: {
          model: Profiles,
          required: true,
          attributes: ["image", "name", "address", "no_hp"],
        },
        where: {
          token: refreshToken,
        },
      });
      res.status(200).json({ msg: user });
    }
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
    const user = await Users.findOne({
      where: {
        token: refreshToken,
      },
    });
    if (!user) {
      return res.sendStatus(204);
    }
    const userId = user.id;
    await Users.update(
      { token: null },
      {
        where: {
          id: userId,
        },
      }
    );
    res.clearCookie("refreshToken");
    return res
      .status(200)
      .json({ statusCode: 200, success: true, message: "Logout Successfully" });
  } catch (error) {
    console.log(error);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadProfileImages = multer({
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
}).single("image");

const updateProfile = async (req, res) => {
  const UserId = req.params.id
  const { name, city, address, no_hp } = req.body;
  const image = req.file.filename;
  // const token = req.headers.authorization?.split(" ")[1];
  // const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  try {
    // if (UserId != decoded.userId) {
    //   return res.status(403).json({
    //     message: "Cannot update profile!",
    //     statusCode: 403,
    //   });
    // }

    await Profiles.update(
      { image, name, city, address, no_hp },
      {
        where: {
          UserId,
        },
      }
    );
    const afterUpdate = await Profiles.findOne({
      attributes: ["image", "name", "address", "no_hp"],
      where: {
        id: UserId,
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
  uploadProfileImages,
  updateProfile,
  logout,
};
