const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const File = new Schema({
	fieldname: { type: String },
	originalname: { type: String },
	encoding: { type: String },
	mimetype: { type: String },
	destination: { type: String },
	filename: { type: String },
	path: { type: String },
	size: { type: Number }
});

const PostSchema = new Schema({
	title: { type: String, required: true, minLength: 1 },
	description: { type: String },
	post: { type: String, required: true, minLength: 1 },
	date: { type: Date, required: true },
	author: { type: String, required: true, minLength: 2 },
	comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	file: File,
	gallery: [File]
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
