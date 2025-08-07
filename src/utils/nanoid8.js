const { customAlphabet } = require("nanoid");

// Define the characters to be used for the ID generation
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Create a custom ID generator with the specified alphabet and length
module.exports = customAlphabet(alphabet, 8);
