const mongoose = require("mongoose");

new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  url: {
    type: String,
    default: "#",
  },
});
