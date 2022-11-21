const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const users = require("./routes/user-routes");
const sections = require("./routes/section-routes");
const posts = require("./routes/post-routes");
const archives = require("./routes/archive-routes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({limit: '50mb'}));

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, function (err, res) {
  if (err) {
    logger.error('Error connecting');
    throw  err;
  }
});

const connection = mongoose.connection;

app.use("/user", users);
app.use("/section", sections);
app.use("/post", posts);
app.use("/archive", archives);

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.listen(port, () => {
  console.log("Server is running: " + port);
});

