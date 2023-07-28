const comment = require("../../models/comment/comment");
const post = require("../../models/post/post");
const user = require("../../models/user/user");

const appErr = require("../../utils/appErr");
//create
const createCommentCtrl = async (req, res, next) => {
  const { message } = req.body;
  try {
    const Post = await post.findById(req.params.id);
    const Comment = await comment.create({
      user: req.session.userAuth,
      message,
      post: Post._id,
    });
    Post.comments.push(Comment._id);
    const User = await user.findById(req.session.userAuth);
    User.comments.push(Comment._id);
    await Post.save({ validateBeforeSave: false });
    await User.save({ validateBeforeSave: false });
    console.log(Post);
    res.redirect(`/api/v1/posts/${Post._id}`);
  } catch (error) {
    next(appErr(error.message));
  }
};

//single
const commentDetailsCtrl = async (req, res, next) => {
  try {
    const Comment = await comment.findById(req.params.id);
    res.render("comments/updateComment", {
      Comment,
      error: "Comment fetching failed",
    });
  } catch (error) {
    res.render("comments/updateComment", {
      error: error.message,
    });
  }
};

//delete
const deleteCommentCtrl = async (req, res, next) => {
  console.log(req.query.postId);
  try {
    //find the post
    const Comment = await comment.findById(req.params.id);
    if (Comment.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("you are not allowed to delete this comment", 403));
    }
    await comment.findOneAndDelete(req.params.id);
    res.redirect(`/api/v1/posts/${req.query.postId}`);
  } catch (error) {
    next(appErr(error));
  }
};

//Update
const upddateCommentCtrl = async (req, res, next) => {
  try {
    //find the post
    const Comment = await comment.findById(req.params.id);
    console.log(Comment);
    if (!Comment) {
      return next(appErr("comment not found"));
    }
    if (Comment.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("you are not allowed to delete this comment", 403));
    }
    //update
    console.log(req.query.postId);
    const commentUpdated = await comment.findByIdAndUpdate(
      req.params.id,
      {
        message: req.body.message,
      },
      {
        new: true,
      }
    );
    res.redirect(`/api/v1/posts/${req.query.postId}`);
  } catch (error) {
    next(appErr(error));
  }
};

module.exports = {
  createCommentCtrl,
  commentDetailsCtrl,
  deleteCommentCtrl,
  upddateCommentCtrl,
};
