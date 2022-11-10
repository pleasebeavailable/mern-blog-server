const mongoose = require("mongoose");

new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  image: {
    type: String,
    default: "https://source.unsplash.com/random",
  },
  imageLabel: {
    type: String,
  },
});
