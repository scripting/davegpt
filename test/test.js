const fs = require ("fs");
const daveutils = require ("daveutils");
const davegpt = require ("davegpt");

var myChatGpt;

fs.readFile ("config.json", function (err, jsontext) {
	if (err) {
		console.log (err.message);
		}
	else {
		const config = JSON.parse (jsontext);
		const options = {
			apiKey: config.chatGptApiKey
			};
		myChatGpt = new davegpt.chatWithChatGpt (options);
		myChatGpt.sendMessage (config.messageText, function (err, responseText) {
			if (err) {
				console.log (err.message);
				}
			else {
				console.log (responseText);
				}
			});
		}
	});
