const mongoose = require("mongoose");

new mongoose.Schema({
  post_comment: {
    post_id: String,
    comment: String,
  },
});
