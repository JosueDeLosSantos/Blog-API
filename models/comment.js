const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
	email: { type: String, required: true, maxLength: 50 },
	comment: { type: String, required: true, maxLength: 3000 },
});

module.exports = mongoose.model('Comment', commentsSchema);
