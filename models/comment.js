const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const commentsSchema = new Schema({
	email: { type: String, required: true, maxLength: 50 },
	comment: { type: String, required: true, maxLength: 3000 },
	date: { type: Date, required: true },
	post: { type: Schema.Types.ObjectId, ref: 'Post' },
});

function removeAst(dateString) {
	// Define the regular expression pattern to match "AST"
	const pattern = /\bAST\b/gi;

	// Replace occurrences of "AST" with an empty string
	const cleanedDate = dateString.replace(pattern, '');

	return cleanedDate;
}

commentsSchema.virtual('virtual_date').get(function () {
	const notFormattedDate = DateTime.fromJSDate(this.date)
		.setLocale('en')
		.toLocaleString(DateTime.DATETIME_FULL); // format: February 14, 2024 at 6:04 PM AST
	const formattedDate = removeAst(notFormattedDate);
	return formattedDate;
});

module.exports = mongoose.model('Comment', commentsSchema);
