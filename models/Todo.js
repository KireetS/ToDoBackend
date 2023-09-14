const mongoose = require("mongoose");
const { Schema } = mongoose;
const TodoSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "general",
  },
  date: {
    type: String,
  },
});

module.exports = mongoose.model("todo", TodoSchema);
