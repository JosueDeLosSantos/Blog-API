const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const File = new mongoose.Schema({
	_id: false,
	filename: String,
	originalname: String,
	mimetype: String,
	path: String,
	size: Number
});

const commentsSchema = new Schema({
	email: { type: String, required: true, maxLength: 50 },
	name: { type: String, required: true, maxLength: 100 },
	comment: { type: String, required: true, maxLength: 3000 },
	author: { type: Schema.Types.ObjectId, ref: "User" },
	date: { type: Date, required: true },
	post: { type: Schema.Types.ObjectId, ref: "Post" },
	photo: File
});

function removeTimezone(dateString) {
	// Extract the date and time without the timezone
	const regex = /^.*(AM|PM)/;
	const cleanedDate = dateString.match(regex)[0];

	return cleanedDate;
}

commentsSchema.virtual("virtual_date").get(function () {
	const notFormattedDate = DateTime.fromJSDate(this.date)
		.setLocale("en")
		.toLocaleString(DateTime.DATETIME_FULL); // format: February 14, 2024 at 6:04 PM AST
	const formattedDate = removeTimezone(notFormattedDate);
	return formattedDate;
});

module.exports = mongoose.model("Comment", commentsSchema);
