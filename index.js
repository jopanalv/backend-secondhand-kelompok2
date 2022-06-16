// index.js
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const router = require('./routes');
const cookieParser = require('cookie-parser')
const cors = require("cors");

dotenv.config();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors());
app.use('/api/v1', router);

// listen on port
app.listen(5000, () => console.log("Server running at http://localhost:5000"));
