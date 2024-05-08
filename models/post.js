const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const File = new Schema({
	_id: false,
	filename: String,
	originalname: String,
	mimetype: String,
	path: String,
	size: Number
});

const PostSchema = new Schema({
	title: { type: String, required: true, minLength: 1 },
	description: { type: String },
	post: { type: String, required: true, minLength: 1 },
	date: { type: Date, required: true },
	author: { type: String, required: true, minLength: 2 },
	comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	file: File
});

function removeTimezone(dateString) {
	// Extract the date and time without the timezone
	const regex = /^.*(AM|PM)/;
	const cleanedDate = dateString.match(regex)[0];

	return cleanedDate;
}

PostSchema.virtual("virtual_date").get(function () {
	const notFormattedDate = DateTime.fromJSDate(this.date)
		.setLocale("en")
		.toLocaleString(DateTime.DATETIME_FULL); // format: February 14, 2024 at 6:04 PM AST
	const formattedDate = removeTimezone(notFormattedDate);
	return formattedDate;
});

module.exports = mongoose.model("Post", PostSchema);
