const mongoose = require("mongoose");
const section = require("./section")

new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  description: {
    type: String
  },
  archives: [{
    type: section,
  }],
  social: [{
    type: String
  }]
});
