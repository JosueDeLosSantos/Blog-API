const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Comment = require("../models/comment");
const Post = require("../models/post");

exports.admin_comment = [
	body("comment")
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage("Comment must be specified."),
	asyncHandler(async (req, res, next) => {
		// Extract the validation errors from a request
		const errors = validationResult(req);

		const comment = new Comment({
			email: req.user.email,
			name: req.user.first_name + " " + req.user.last_name,
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
			let newPost = await Post.findById(post._id).populate("comments");

			const postWithFormattedDates = {
				...newPost._doc,
				date: newPost.virtual_date,
				comments: newPost.comments.map((comment) => ({
					...comment._doc,
					date: comment.virtual_date
				})),
				user: req.user
			};

			res.json({ post: postWithFormattedDates });
		}
	})
];
// Delete specific comments
exports.admin_delete_comment = asyncHandler(async (req, res, next) => {
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
