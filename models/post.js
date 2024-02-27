const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
	title: { type: String, required: true, minLength: 1 },
	post: { type: String, required: true, minLength: 1 },
	date: { type: Date, required: true },
	author: { type: String, required: true, minLength: 2 },
	comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

function removeAst(dateString) {
	// Define the regular expression pattern to match "AST"
	const pattern = /\bAST\b/gi;

	// Replace occurrences of "AST" with an empty string
	const cleanedDate = dateString.replace(pattern, "");

	return cleanedDate;
}

PostSchema.virtual("virtual_date").get(function () {
	const notFormattedDate = DateTime.fromJSDate(this.date)
		.setLocale("en")
		.toLocaleString(DateTime.DATETIME_FULL); // format: February 14, 2024 at 6:04 PM AST
	const formattedDate = removeAst(notFormattedDate);
	return formattedDate;
});

module.exports = mongoose.model("Post", PostSchema);
