const mongoose = require("mongoose");

new mongoose.Schema({
  post: {
    required: true,
    type: String,
  },
});
