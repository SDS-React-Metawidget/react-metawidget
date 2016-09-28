'use strict'

const express = require('express');
const app = express();

app.use(express.static('files'));
app.get('/', function (req, res) {
	res.sendFile(__dirname + "/index.html");
	console.log(req.connection.remoteAddress);
})

const server = app.listen(7001, () => {

	let host = server.address().address;
	let port = server.address().port;

	console.log("Example app listening at http://%s:%s", host, port);
})
