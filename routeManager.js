/**
 * Created by AltonjiC on 9/26/15.
 */
var express = require('express');
var router = express.Router();
var path = __dirname + '/views/';

router.get("/",function(req,res) {
  res.sendFile(path + "index.html");
});

router.get("/login",function(req,res) {
  res.sendFile(path + "login.html");
});

router.get("/register",function(req,res) {
  res.sendFile(path + "registration.html");
});

router.get("/home",function(req,res) {
  res.sendFile(path + "customer/customer_home.html");
});


module.exports = router;