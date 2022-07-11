const jwt = require("jsonwebtoken");

const checkToken = (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token,", token);
    if (token == null) return res.sendStatus(401);
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return res
      .status(201)
      .json({ status: 201, message: "Data found!", data: decoded });
  } catch (error) {
    console.log(error);
    if (error == "TokenExpiredError: jwt expired") {
      return res.status(403).json({ status: 403, message: "Token Expired!" });
    }
  }
};

const signToken = (req, res) => {
  try {
    const refreshToken = jwt.sign(
      { userId: req.user.id, email: req.user.email, role: req.user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const accessToken = jwt.sign(
      { userId: req.user.id, email: req.user.email, role: req.user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: 302,
      success: "User logged in",
      accessToken: accessToken,
    });
  } catch (error) {
    console.log(error);
  }
};

const newToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.json({
        message: "Can't find refresh token, please login again",
        statusCode: 401,
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
        const userId = decoded.userId;
        const email = decoded.email;
        const role = decoded.role;
        const accessToken = jwt.sign(
          { userId, email, role },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1h",
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

module.exports = { checkToken, signToken, newToken };
