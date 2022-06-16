// index.js
const express = require('express')
const app = express();
const router = require('./routes');

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// route
app.use('/api/v1', router)

// listen on port
app.listen(5000, () => console.log("Server running at http://localhost:5000"));
