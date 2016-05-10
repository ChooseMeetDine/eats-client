require('dotenv').config();
var express = require('express');
var app = express();

app.use(express.static(__dirname));

var port = process.env.PORT || 4444;

app.listen(port, function() {
  console.log('Server for Angular client listening on port ' + port + '!');
});
