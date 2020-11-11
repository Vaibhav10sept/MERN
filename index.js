const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { User } = require("./models/user");
const mongoose = require("mongoose");
const config = require("./config/key");

const cookieParser = require("cookie-parser");
const user = require("./models/user");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB connected").catch((err) => console.log(err));
  });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.post("/api/users/register", (res, req) => {
  const user = new User(req.body);
  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.statusCode(200).json({
      success: true,
      userData: doc,
    });
  });
});

app.post("/api/user/login", (res, req) => {
  // find the email
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginsuccess: false,
        message: "auth failed, email not found ",
      });
    // compare the pasword
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginsuccess: false,
          message: "wrong password",
        });
      // generate token

      user.generateToken((err, user) => {
          if(err) return res.statusCode(400).send(err)
          res.cookie('x_auth',user.token).status(200).json({
              loginsuccess:true
          })
      });
    });
  });
});

app.get("/", (req, res) => {
  res.send("hello vaibhav");
});

app.listen(5000);
