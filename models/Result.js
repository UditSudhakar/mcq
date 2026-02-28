const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  score: Number,
  total: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Result", resultSchema);