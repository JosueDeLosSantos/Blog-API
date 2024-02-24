const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	first_name: { type: String, required: true, maxLength: 50 },
	last_name: { type: String, required: true, maxLength: 100 },
	username: { type: String, required: true, maxLength: 50 },
	password: { type: String, required: true, minLength: 8 },
});

module.exports = mongoose.model('User', userSchema);
