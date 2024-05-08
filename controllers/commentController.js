const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Comment = require("../models/comment");
const Post = require("../models/post");

exports.comment_post = [
	body("email")
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage("Email must be specified.")
		.isEmail()
		.withMessage("A valid email must be specified"),
	body("name")
		.trim()
		.isLength({ min: 2 })
		.escape()
		.withMessage("Name must be specified."),
	body("comment")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Comment must be specified."),
	asyncHandler(async (req, res, next) => {
		// Extract the validation errors from a request
		const errors = validationResult(req);

		const comment = new Comment({
			email: req.body.email,
			name: req.body.name,
			comment: req.body.comment,
			date: new Date(),
			post: req.body.post // Blog post were comment will be added
		});
		if (!errors.isEmpty()) {
			// There are errors, return wrong typed data and errors
			res.json({
				comment: comment,
				errors: errors.array()
			});
			return;
		} else {
			// save comment in database
			const savedComment = await comment.save();
			// Find the proper post for the comment
			const post = await Post.findById(comment.post);
			// insert comment in the first index of the post's comments array,
			// so most recent comments will show first
			post.comments.splice(0, 0, savedComment._id);
			// update proper post
			await Post.findByIdAndUpdate(post._id, post, {});
			res.json({ date: comment.virtual_date });
		}
	})
];
// Delete specific comments
exports.delete_comment = asyncHandler(async (req, res, next) => {
	// Find comment
	const comment = await Comment.findById(req.params.id);
	// Find post where it belongs
	const post = await Post.findById(comment.post);
	// Update post
	post.comments = post.comments.filter((param) => param != req.params.id);
	await Post.findByIdAndUpdate(post._id, post, {});
	// Delete comment
	await Comment.findByIdAndDelete(req.params.id);
	res.json({ message: "comment deleted" });
});
