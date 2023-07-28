const mongoose = require("mongoose");

//comment schema
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    message: {
      type: String,
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//compile schema to form a model
const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;
