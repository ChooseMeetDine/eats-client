var express = require('express');
var app = express();

app.use(express.static(__dirname + '/eats-client'));

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.listen(4444, function() {
  console.log('Server for Angular client listening on port 4444!');
});
