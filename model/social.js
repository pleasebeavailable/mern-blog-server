const mongoose = require("mongoose");

new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  icon: {
    type: String,
    // TODO kako sacuvat ikonu
  },
});
