/**
 * Created by AltonjiC on 9/26/15.
 */
var express = require('express');
var router = express.Router();
var path = __dirname + '/views/';

router.get("/",function(req,res) {
  res.sendFile(path + "index.html");
});

module.exports = router;