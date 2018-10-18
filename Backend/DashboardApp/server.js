
const PORT = process.env.PORT || 3233;
console.log(PORT);

var express = require('express');
var server = express();
server.use('/', express.static(__dirname + '/'));
server.listen(PORT);