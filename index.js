var express = require('express');
var app = express();

app.use(express.static(__dirname));

app.listen(4444, function() {
  console.log('Server for Angular client listening on port 4444!');
});
