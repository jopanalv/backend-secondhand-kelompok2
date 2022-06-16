// index.js
const express = require("express");
const router = require("./routes/index");
const dotenv = require("dotenv");
const app = express();
const router = require('./routes');

dotenv.config();

app.use(express.json());
app.use(router);

// listen on port
app.listen(5000, () => console.log("Server running at http://localhost:5000"));
