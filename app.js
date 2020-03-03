const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//what the server needs to GET. Below is root
app.get("/", function (req, resp) {
	console.log(req);
	resp.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
	let fName = req.body.fName;
	let lName = req.body.lName;
	let email = req.body.email;
	
	var data = {
		members: [
			{
				email_address: email, 
				status: "subscribed",
				merge_fields: {FNAME: fName, LNAME: lName}
			}
		]
	};

	var jsonData = JSON.stringify(data);

	var options = {
		url: "https://us4.api.mailchimp.com/3.0/lists/ac15786e84",
		method: "POST",
		headers: {Authorization: "me c0f9bfe93e61f524094c7ae4b93996fe-us4"},
		body: jsonData
	};

	request(options, function(err, resp, body) {
		if (err) {
			console.log(err);
			res.sendFile(__dirname + "/failure.html");
		} 
		if (resp.statusCode === 200) {
			res.sendFile(__dirname + "/success.html");
		} else {
			res.sendFile(__dirname + "/failure.html");
		}
	});
});

app.listen(3000, function () {
	console.log("server has started at port 3000");
});