const myVersion = "0.4.0", myProductName = "davegpt"; 

exports.chatWithChatGpt = chatWithChatGpt;

const utils = require ("daveutils");
const request = require ("request");


//below, i've included the code from commoncode.js here -- 12/18/24 by DW

function httpRequest (url, method, timeout, headers, data, callback) { 
	var myHttpRequest;
	function isNodeEnvironment () {
		if ((typeof process !== "undefined") && (typeof process.versions !== "undefined") && (typeof process.versions.node !== "undefined")) {
			return (true); //running in Node
			}
		else {
			return (false); //running in the browser
			}
		}
	function nodeHttpRequest (url, method, timeout, headers, data, callback) {
		timeout = (timeout === undefined) ? 30000 : timeout;
		headers = (headers === undefined) ? new Object () : headers;
		
		const theRequest = {
			url,
			method,
			timeout,
			headers,
			body: (method.toLowerCase () == "post") ? data : undefined,
			json: true
			};
		
		request (theRequest, function (err, response, body) {
			if (err) {
				callback (err);
				}
			else {
				if (response.statusCode >= 200 && response.statusCode <= 299) {
					if (body.error === undefined) {
						callback (undefined, body); //body is already parsed as JSON due to json: true in theRequest
						}
					else {
						callback (body.error);
						}
					} 
				else {
					var theError;
					try {
						theError = body.error; //a strange quirk of OpenAI
						}
					catch (err) {
						const message = "Couldn't make the HTTP request because there was an error == " + response.statusCode + ".";
						theError = {message};
						}
					callback (theError);
					}
				}
			});
		}
	function browserHttpRequest (url, method, timeout, headers, data, callback) { 
		timeout = (timeout === undefined) ? 30000 : timeout;
		var jxhr = $.ajax ({ 
			url,
			method,
			headers,
			timeout,
			data: (method.toLowerCase () == "post") ? JSON.stringify (data) : undefined
			}) 
		.success (function (data, status) { 
			callback (undefined, data);
			}) 
		.error (function (status) { 
			var message;
			try { //9/18/21 by DW
				message = JSON.parse (status.responseText).message;
				}
			catch (err) {
				message = status.responseText;
				}
			if ((message === undefined) || (message.length == 0)) { //7/22/22 by DW & 8/31/22 by DW
				message = "There was an error communicating with the server.";
				}
			var err = {
				code: status.status,
				message
				};
			callback (err);
			});
		}
	if (isNodeEnvironment ()) {
		myHttpRequest = nodeHttpRequest;
		}
	else {
		myHttpRequest = browserHttpRequest;
		}
	return (myHttpRequest (url, method, timeout, headers, data, callback));
	}
function chatWithChatGpt (userOptions) {
	const options = {
		userPrompt: "Greetings!",
		apiUrl: "https://api.openai.com/v1/chat/completions",
		apiKey: undefined,
		systemRole: "You are a helpful assistant.",
		httpRequestCallback: httpRequest //12/17/24 by DW
		};
	utils.mergeOptions (userOptions, options);
	
	var messages, conversation;
	
	function init () {
		messages = [
			{role: "system", content: options.systemRole}
			];
		conversation = [
			];
		}
	
	
	function sendMessage (theMessage, callback) {
		const newMessage = {role: "user", content: theMessage};
		messages.push (newMessage);
		conversation.push (newMessage);
		
		const timeout = undefined; //accept the default
		const headers = {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${options.apiKey}`
			};
		const bodyStruct = {
			model: "gpt-4",
			messages: messages
			};
		
		console.log ("sendMessage: messages == " + utils.jsonStringify (messages));
		options.httpRequestCallback (options.apiUrl, "POST", timeout, headers, bodyStruct, function (err, dataFromChatGpt) {
			if (err) {
				console.log (err.message);
				if (callback !== undefined) {
					callback (err);
					}
				}
			else {
				const responseMessage = dataFromChatGpt.choices [0].message;
				console.log ("sendMessage: responseMessage.content == " + utils.jsonStringify (responseMessage.content));
				conversation.push (responseMessage.content);
				if (callback !== undefined) {
					callback (err, utils.jsonStringify (responseMessage.content));
					}
				}
			});
		}
	function getConversation () {
		return (conversation);
		}
	
	init ();
	this.sendMessage = sendMessage;
	this.getConversation = getConversation;
	this.init = init;
	}




