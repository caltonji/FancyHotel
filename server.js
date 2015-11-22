var express = require("express");
var app = express();
var router = express.Router();

app.use(express.static(__dirname + '/public/'));

/* route manager */
var routes = require('./routeManager');
/* look inn route manager for routes */
app.use('/', routes);

/**
 * Event listener for HTTP server "listening" event.
 */
app.listen(3004,function(){
  console.log("Live at Port 3004");
});
