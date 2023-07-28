const express = require("express");
const multer = require("multer");
const storage = require("../../config/cloudinary");

const {
  createPostCtrl,
  deletePostCtrl,
  fetchPostCtrl,
  fetchPostsCtrl,
  updatepostCtrl,
} = require("../../controller/posts/posts");
const protected = require("../../middlewares/protected");
const postRouter = express.Router();
const post = require("../../models/post/post");
//instance of multer
const upload = multer({
  storage,
});
//form
postRouter.get("/get-post-form", (req, res) => {
  res.render("posts/addPost", { error: "" });
});

postRouter.get("/get-form-update/:id", async (req, res) => {
  try {
    const Post = await post.findById(req.params.id);
    res.render("posts/updatePost", { Post, error: "" });
  } catch (error) {
    res.render("posts/updatePost", { error, Post: "" });
  }
});
//POST/api/v1/posts
postRouter.post("/", protected, upload.single("file"), createPostCtrl);

//GET/api/v1/posts
postRouter.get("/", fetchPostsCtrl);

//GET/api/v1/posts/:id
postRouter.get("/:id", fetchPostCtrl);

//DELETE/api/v1/posts/:id
postRouter.delete("/:id", protected, deletePostCtrl);

//PUT/api/v1/posts/:id
postRouter.put("/:id", protected, upload.single("file"), updatepostCtrl);

module.exports = postRouter;
