const bcrypt = require("bcryptjs");
const user = require("../../models/user/user");
const appErr = require("../../utils/appErr");
const User = require("../../models/user/user");

//register

const registerCtrl = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  //check if filed is empty
  if (!fullname || !email || !password) {
    return res.render("users/register", {
      error: "All fields are require",
    });
  }
  try {
    const userFound = await user.findOne({ email });
    if (userFound) {
      return res.render("users/register", {
        error: "user already exist",
      });
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    const User = await user.create({
      fullname,
      email,
      password: passwordHashed,
    });
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    res.json(error);
  }
};

//login
const loginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  // if (!email || !password) {
  //   return next(appErr("Email or Password not found"));
  // }
  try {
    const userFound = await user.findOne({ email });
    if (!userFound) {
      return res.render("users/login", {
        error: "invalid login credentials",
      });
    }
    //verify password
    const isPasswordValid = await bcrypt.compare(password, userFound.password);
    if (!isPasswordValid) {
      return res.render("users/login", {
        error: "invalid login credentials",
      });
    }
    req.session.userAuth = userFound._id;
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    res.json(error);
  }
};

//details
const userDetailsCtrl = async (req, res) => {
  try {
    const userId = req.params.id;
    const User = await user.findById(userId);

    res.render("users/updateUser", {
      User,
    });
  } catch (error) {
    res.json(error);
  }
};
//profile
const profileCtrl = async (req, res) => {
  try {
    //get login user
    const userID = req.session.userAuth;
    //find the user

    const User = await user
      .findById(userID)
      .populate("posts")
      .populate("comments");
    res.render("users/profile", { User });
  } catch (error) {
    res.json(error);
  }
};
//upload profile photo
const uploadProfilePhotoCtrl = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.render("users/uploadProfilePhoto", {
        error: "please upload image",
      });
    }
    //1 find user to updated
    const userId = req.session.userAuth;
    const userFound = await user.findById(userId);

    if (!userFound) {
      return res.render("users/uploadProfilePhoto", {
        error: "user not found",
      });
    }
    await user.findByIdAndUpdate(
      userId,
      {
        profileImage: req.file.path,
      },
      {
        new: true,
      }
    );
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    return res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};

//upload cover image

const uploadCoverImgCtrl = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.render("users/uploadCoverPhoto", {
        error: "please upload image",
      });
    }
    //1 find user to updated
    const userId = req.session.userAuth;
    const userFound = await user.findById(userId);

    if (!userFound) {
      return res.render("users/uploadCoverPhoto", {
        error: "user not found",
      });
    }
    await user.findByIdAndUpdate(
      userId,
      {
        coverImage: req.file.path,
      },
      {
        new: true,
      }
    );
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    return res.render("users/uploadCoverPhoto", {
      error: error.message,
    });
  }
};

//update password
const updatePasswordCtrl = async (req, res, next) => {
  const { password } = req.body;
  try {
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHashed = await bcrypt.hash(password, salt);
      await user.findByIdAndUpdate(
        req.session.User,
        {
          password: passwordHashed,
        },
        {
          new: true,
        }
      );
    }
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    return res.render("users/uploadCoverPhoto", {
      error: error.message,
    });
  }
};

//update user
const updateUserCtrl = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  try {
    if (email) {
      const emailTaken = await user.findOne({ email });
      if (emailTaken) {
        return res.render("users/updateUser", {
          error: "Email is taken",
          User: "",
        });
      }
    }
    await user.findByIdAndUpdate(
      req.session.userAuth,
      {
        fullname,
        email,
      },
      {
        new: true,
      }
    );
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    return res.render("users/updateUser", {
      error: error.message,
      User: "",
    });
  }
};

//logout
const logoutCtrl = async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/api/v1/users/login");
  });
};

module.exports = {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverImgCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
};
