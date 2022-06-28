const { Users } = require("../models");
const jwt = require("jsonwebtoken");

const newToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.json({
        message: "Can't find refresh token, please login again",
        statusCode: 401,
      });
    }

    const user = await Users.findOne({
      where: {
        token: refreshToken,
      },
    });
    if (!user) {
      return res.status(403).json({
        message: "Refresh token does not valid",
        statusCode: 403,
      });
    }
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(403).json({
            message: "Refresh token does not valid",
            statusCode: 403,
          });
        }
        const userId = user.id;
        const email = user.email;
        const role = user.role;
        const accessToken = jwt.sign(
          { userId, email, role },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );
        res.status(200).json({
          message: "Success get new access token!",
          statusCode: 200,
          accessToken: accessToken,
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = { newToken };
