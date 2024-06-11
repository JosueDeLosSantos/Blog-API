const mongoose = require("mongoose");

const File = new mongoose.Schema({
	_id: false,
	filename: String,
	originalname: String,
	mimetype: String,
	path: String,
	size: Number
});

const userSchema = new mongoose.Schema({
	first_name: { type: String, required: true, maxLength: 20 },
	last_name: { type: String, required: true, maxLength: 40 },
	email: { type: String, required: true, maxLength: 100 },
	username: { type: String, required: true, maxLength: 50 },
	password: { type: String, required: true, maxLength: 100 },
	photo: File
});

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", userSchema);

module.exports = { User, Admin };
