// index.js
const express = require("express");
const router = require("./routes/index");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// listen on port
app.listen(5000, () => console.log("Server running at http://localhost:5000"));
