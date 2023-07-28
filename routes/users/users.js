const express = require("express");
const multer = require("multer");
const {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverImgCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
} = require("../../controller/users/users");
const protected = require("../../middlewares/protected");
const storage = require("../../config/cloudinary");

const userRouter = express.Router();
const upload = multer({ storage });
userRouter.get("/login", (req, res) => {
  res.render("users/login", {
    error: "",
  });
});
userRouter.get("/register", (req, res) => {
  res.render("users/register", {
    error: "",
  });
});
// userRouter.get("/profile", (req, res) => {
//   // res.render("users/profile", {
//   //   error: "",
//   // });
// });
userRouter.get("/upload-profile-photo-form", (req, res) => {
  res.render("users/uploadProfilePhoto", { error: "" });
});
userRouter.get("/upload-cover-photo-form", (req, res) => {
  res.render("users/uploadCoverPhoto", { error: "" });
});
userRouter.get("/update-user-password", (req, res) => {
  res.render("users/updatePassword", { error: "" });
});
//POST/api/v1/users/register
userRouter.post("/register", registerCtrl);

//POST/api/v1/users/login
userRouter.post("/login", loginCtrl);

//GET/api/v1/users/profile/
userRouter.get("/profile", protected, profileCtrl);

//PUT/api/v1/users/profile-photo-upload/:id
userRouter.put(
  "/profile-photo-upload/",
  protected,
  upload.single("profile"),
  uploadProfilePhotoCtrl
);

//PUT/api/v1/users/cover-photo-upload/:id
userRouter.put(
  "/cover-photo-upload/",
  protected,
  upload.single("profile"),
  uploadCoverImgCtrl
);

//PUT/api/v1/users/update-password/:id
userRouter.put("/update-password/", updatePasswordCtrl);

//PUT/api/v1/users/update/:id
userRouter.put("/update", updateUserCtrl);
//GET/api/v1/users/logout
userRouter.get("/logout", logoutCtrl);
//GET/api/v1/users/:id
userRouter.get("/:id", userDetailsCtrl);

module.exports = userRouter;
