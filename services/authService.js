/* istanbul ignore file */
const jwt = require("jsonwebtoken");

const checkToken = (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return res
      .status(201)
      .json({ status: 201, message: "Data found!", data: decoded });
  } catch (error) {
    if (error == "TokenExpiredError: jwt expired") {
      return res.status(403).json({ status: 403, message: "Token Expired!" });
    }
    return res.status(500).json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
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
    console.log("Your path ", req._parsedUrl.pathname);
    if (req._parsedUrl.pathname == "/auth/google/callback") {
      return res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .redirect("/api/v1/auth/google/googleAccessToken");
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Login success!",
      accessToken: accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
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
    return res.status(500).json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};
const verifyRole = (req, res) => {
  const token = req.cookies.accessToken;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(301)
        .json({ status: 301, message: "Please login again!" });
    }
    if (decoded.role == null) {
      res.status(202).json({
        status: 202,
        message: "Google Login, But You don't have a role!",
        accessToken: req.cookies.accessToken,
        role: decoded.role,
      });
    } else {
      res.status(200).json({
        status: 200,
        message: "Google User Logged In!",
        accessToken: req.cookies.accessToken,
        haveRole: true,
        role: decoded.role,
      });
    }
  });
};

module.exports = { checkToken, signToken, newToken, verifyRole };
