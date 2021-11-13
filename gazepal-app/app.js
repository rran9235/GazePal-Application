/*
GazePal Application
Author: Rishi Rangarajan
Year: 2021 

File: app.js
Info: Node.js backend to write to MCU
*/

const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const SerialPort = require('serialport');
const port = new SerialPort("COM9", {baudRate: 9600});


var jsonParser = bodyParser.json()

app.use(
	cors({
	origin: "http://localhost:3000"
	})
)

// Get data from post
app.post("/post", jsonParser, (req, res) => {
	console.log("Connected to React");
	console.log(req.body);
	// Get request with angles
	var angles = req.body.pan + "," + req.body.tilt;
	// Write to serial port
	port.write(angles, (err) => {
		if (err) {
		  return console.log('Error on write: ', err.message);
		}
		console.log(angles);
	  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
