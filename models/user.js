const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	first_name: { type: String, required: true, maxLength: 20 },
	last_name: { type: String, required: true, maxLength: 40 },
	email: { type: String, required: true, maxLength: 100 },
	username: { type: String, required: true, maxLength: 50 },
	password: { type: String, required: true, minLength: 100 }
});

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", userSchema);

module.exports = { User, Admin };
