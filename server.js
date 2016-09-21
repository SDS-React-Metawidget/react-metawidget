var express = require('express');
var app = express();

app.use(express.static('files'));
app.get('/', function (req, res) {
	res.sendFile(__dirname + "/index.html");
	console.log(req.connection.remoteAddress);
})

var server = app.listen(7001, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log("Example app listening at http://%s:%s", host, port);
})