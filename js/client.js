// Client-side script for handling socket.io connections

// Connect to the server running on localhost:8000
const socket = io('http://localhost:8000');

// Get references to form, input field, and message container
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// Audio that will play when a message is received
var audio = new Audio('iphone_pink.mp3');

// Function to append messages to the chat container
const append = (message, position) => {
    const messageElement = document.createElement('div'); // Create a new message element
    messageElement.innerText = message; // Set message text
    messageElement.classList.add('message'); // Add common 'message' class
    messageElement.classList.add(position); // Add position class (left/right)
    messageContainer.append(messageElement); // Append the message to the container

    // Play audio if the message is received from another user
    if (position == 'left') audio.play();
}

// Event listener for the message form submission
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    const message = messageInput.value; // Get message from input field
    append(`You: ${message}`, 'right'); // Display your message on the right
    socket.emit('send', message); // Send message to the server
    messageInput.value = ''; // Clear the input field
});

// Send user's name to the server when they join
const name = prompt("Enter your name to join") || "Anonymous"; // Prompt for name, default to 'Anonymous' if empty
socket.emit('new-user-joined', name);

// When a new user joins the chat
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right'); // Display joined message
});

// When a message is received from another user
socket.on('receive', data => {
    append(`${data.name}: ${data.message} `, 'left'); // Display received message on the left
});

// When a user leaves the chat
socket.on('left', name => {
    append(`${name} left the chat `, 'right'); // Display left message on the right
});