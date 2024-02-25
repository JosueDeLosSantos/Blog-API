const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Comment = require('../models/comment');
const Post = require('../models/post');

exports.comment_post = [
	body('email')
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage('Email must be specified.')
		.isEmail()
		.withMessage('A valid email must be specified'),
	body('comment')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('Comment must be specified.'),
	asyncHandler(async (req, res, next) => {
		// Extract the validation errors from a request
		const errors = validationResult(req);
		// Post comments on posts
		const comment = new Comment({
			email: req.body.email,
			comment: req.body.comment,
			date: new Date(),
			post: req.body.post,
		});
		if (!errors.isEmpty()) {
			// There are errors, return wrong typed data and errors
			res.json({
				comment: comment,
				errors: errors.array(),
			});
		} else {
			// save comment in database
			const savedComment = await comment.save();

			if (savedComment) {
				// Update corresponding post
				const post = await Post.findById(comment.post);
				post.comments.push(savedComment._id);
				await Post.findByIdAndUpdate(post._id, post, {});
			}
			res.json({ message: 'Comment saved' });
		}
	}),
];
