require("dotenv").config();
const express = require("express");
const userRouter = require("./routes/users/users");
const postRouter = require("./routes/posts/post");
const commentRouter = require("./routes/comments/comments");
const globalErrHandler = require("./middlewares/globalHandler");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const Post = require("./models/post/post");
const { truncatePost } = require("./utils/helpers");
require("./config/dbConnect");

const app = express();

//helpers
app.locals.tuncatePost = truncatePost;
app.use(express.json()); //pass imcommenig data
app.use(express.urlencoded({ extended: true })); //pass form data
//middlewares
//configuration
app.set("view engine", "ejs");

//server static files
//const path = require("path");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/users"));
//session configuration
//method override
app.use(methodOverride("_method"));

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URL,
      ttl: 24 * 60 * 60,
    }),
  })
);
//save the login user into locals
app.use((req, res, next) => {
  if (req.session.userAuth) {
    res.locals.userAuth = req.session.userAuth;
  } else {
    res.locals.userAuth = null;
  }
  next();
});
//render home page
app.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("user");
    res.render("index", { posts });
  } catch (error) {
    res.render("index", { error: error.message });
  }
});
app.use("/api/v1/users", userRouter);
//users routr
//post router
app.use("/api/v1/posts", postRouter);
//POST/api/v1/posts
//comment route
app.use("/api/v1/comments", commentRouter);
//error handler middlewares
app.use(globalErrHandler);
//listen server
const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));
