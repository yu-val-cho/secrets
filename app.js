//jshint esversion:6
require('dotenv').config();

const _ = require('lodash');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Why no email?']
  },
  password: {
    type: String,
    required: [true, 'Why no password?']
  }
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password']});

const User = mongoose.model("User", userSchema);


const url = 'mongodb://localhost:27017/';
// const url = 'mongodb+srv://admin-yuval:Test123@cluster0-wkzla.mongodb.net/'
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
const dbName = "userDB";

mongoose.connect(url + dbName, options);


app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/login", function(req, res){
      const userReq = req.body.username;
      const passwordReq = req.body.password

    User.findOne({email: userReq}, function(err, foundUsr){
      if (err) {
        console.log(err);
      } else {
        if (!foundUsr) {
          console.log("didnt find user");
          res.redirect("/");
        } else {
          if (foundUsr.password === passwordReq) {
            res.render("secrets");
          } else {
            console.log("found user, but wrong password");
          }
        }
      }
    });
});

app.post("/register", function(req, res){
    const usr = new User({
      email: req.body.username,
      password: req.body.password
    });

    usr.save(function(err){
      if (err) {
        res.send(err);
      } else {
        console.log("Successfully added new user");
        res.render("secrets")
      }
    });
});





let port = process.env.PORT;

if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port :" + port);
});
