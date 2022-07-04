// index.js
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const router = require("./routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const cookieSession = require("cookie-session");
const passport = require("passport");
const initializePassport = require("./config/passport");

initializePassport(passport);
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(
  cookieSession({
    name: "session-app",
    secret: "uiafhsadifjasdifjnpjasdfhuaslfhdi",

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/v1", router);
app.use("/upload/images", express.static("./upload/images"));

// listen on port
app.listen(PORT, () => console.log("Server running at http://localhost:",PORT));
