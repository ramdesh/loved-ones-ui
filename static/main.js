MESSAGE_URL = "http://localhost:5001/v1/messages"
INFO_URL = "http://localhost:5001/v1/info"


/**
 * Returns the current datetime for the message creation.
 */
function getCurrentTimestamp() {
	return new Date();
}

/**
 * Renders a message on the chat screen based on the given arguments.
 * This is called from the `showUserMessage` and `showBotMessage`.
 */
function renderMessageToScreen(args) {
	// local variables
	let displayDate = (args.time || getCurrentTimestamp()).toLocaleString('en-IN', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	});
	let messagesContainer = $('.messages');

	// init element
	let message = $(`
	<li class="message ${args.message_side}">
		<div class="avatar"></div>
		<div class="text_wrapper">
			<div class="text">${args.text}</div>
			<div class="timestamp">${displayDate}</div>
		</div>
	</li>
	`);

	// add to parent
	messagesContainer.append(message);

	// animations
	setTimeout(function () {
		message.addClass('appeared');
	}, 0);
	messagesContainer.animate({ scrollTop: messagesContainer.prop('scrollHeight') }, 300);
}

/* Sends a message when the 'Enter' key is pressed.
 */
$(document).ready(function() {
    $('#msg_input').keydown(function(e) {
        // Check for 'Enter' key
        if (e.key === 'Enter') {
            // Prevent default behaviour of enter key
            e.preventDefault();
			// Trigger send button click event
            $('#send_button').click();
        }
    });
});

/**
 * Displays the user message on the chat screen. This is the right side message.
 */
function showUserMessage(message, datetime) {
	renderMessageToScreen({
		text: message,
		time: datetime,
		message_side: 'right',
	});
}

/**
 * Displays the chatbot message on the chat screen. This is the left side message.
 */
function showBotMessage(message, datetime) {
	renderMessageToScreen({
		text: message,
		time: datetime,
		message_side: 'left',
	});
}

/**
 * Get input from user and show it on screen on button click.
 */
$('#send_button').on('click', function (e) {
	// get and show message and reset input
	var message = $('#msg_input').val();
	showUserMessage(message);
	$('#msg_input').val('');
	$.ajaxSetup({
		contentType: "application/json; charset=utf-8"
	});
	$.post(
		MESSAGE_URL,
		JSON.stringify({ message: message }),
		function (response) {
			showBotMessage(response.response);
		},
		"json"
	);

	// $.post({
	// 	url: MESSAGE_URL,
	// 	data: { message: message },
	// 	contentType: 'application/json; charset=utf-8'
	// })
	// 	.done(function (response) {
	// 		showBotMessage(response.response);
	// 	});
});

/**
 * Returns a random string. Just to specify bot message to the user.
 */
function randomstring(length = 20) {
	let output = '';

	// magic function
	var randomchar = function () {
		var n = Math.floor(Math.random() * 62);
		if (n < 10) return n;
		if (n < 36) return String.fromCharCode(n + 55);
		return String.fromCharCode(n + 61);
	};

	while (output.length < length) output += randomchar();
	return output;
}

/**
 * Set initial bot message to the screen for the user.
 */
$(window).on('load', function () {
	$.get(INFO_URL, function(data) {
		showBotMessage("You're chatting with model " + data.modelName);
		showBotMessage("The personality that is loaded currently is \"" + data.personality + "\"");
	});
	//showBotMessage('Hello there! Type in a message.');
});