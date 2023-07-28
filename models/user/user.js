const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    profileImage: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    role: {
      type: String,
      default: "Blogger",
    },
    bio: {
      type: String,
      default: "Nice guy",
    },

    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("user", userSchema);

module.exports = User;
