const mongoose = require("mongoose");
const { loadavg } = require("os");
const dbconnect = async () => {
  console.log(process.env);
  try {
    await mongoose.connect(
      "mongodb+srv://vinayakpathak0411:zCLFkEvSMFChipcW@fullstack-blog.nduphom.mongodb.net/fullstack-blog?retryWrites=true&w=majority"
    );
    console.log("DB connected");
  } catch (error) {
    console.log("DB failed", error.message);
  }
};
dbconnect();
