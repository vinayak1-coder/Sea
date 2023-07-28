const post = require("../../models/post/post");
const User = require("../../models/user/user");
const appErr = require("../../utils/appErr");
//create
const createPostCtrl = async (req, res, next) => {
  const { title, description, category, user } = req.body;
  try {
    if (!title || !description || !category || !req.file) {
      return res.render("posts/addPost", { error: "All fields are require" });
    }
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);

    const postCreated = await post.create({
      title,
      description,
      category,
      user: userFound._id,
      image: req.file.path,
    });
    userFound.posts.push(postCreated._id);

    await userFound.save();
    res.redirect("/");
  } catch (error) {
    return res.render("posts/addPost", { error: error.message });
  }
};

//all
const fetchPostsCtrl = async (req, res, next) => {
  try {
    const posts = await post.find().populate("comments").populate("user");
    res.json({
      status: "success",
      data: posts,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//details
const fetchPostCtrl = async (req, res, next) => {
  try {
    //get id from params
    const id = req.params.id;

    const Post = await post
      .findById(id)
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .populate("user");
    res.render("posts/postDetails", {
      Post,
      error: "",
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//delete
const deletePostCtrl = async (req, res, next) => {
  try {
    //find the post
    const Post = await post.findById(req.params.id);
    if (Post.user.toString() !== req.session.userAuth.toString()) {
      return res.render("posts/postDetails", {
        error: "you are not authorized to delete this post",
        post: "",
      });
    }
    await post.findOneAndDelete(req.params.id);
    res.redirect("/");
  } catch (error) {
    return res.render("posts/postDetails", {
      error: error.message,
      post: "",
    });
  }
};

//update
const updatepostCtrl = async (req, res, next) => {
  try {
    //find the post
    const Post = await post.findById(req.params.id);
    if (Post.user.toString() !== req.session.userAuth.toString()) {
      return res.render("posts/updatePost", {
        Post: "",
        error: "you are not allowed",
      });
    }
    console.log(Post);
    const { title, description, category, image } = req.body;
    //check if user is updating image
    if (req.file) {
      await post.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          category,
          image: req.file.path,
        },
        {
          new: true,
        }
      );
    } else {
      await post.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          category,
        },
        {
          new: true,
        }
      );
    }
    //update

    res.redirect("/");
  } catch (error) {
    // return res.render("posts/updatePost", {
    //  Post: "",
    //error: error.message,
    // });
    console.log(error);
  }
};
module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatepostCtrl,
};
