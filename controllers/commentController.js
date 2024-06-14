const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Comment = require("../models/comment");
const Post = require("../models/post");
const { Admin } = require("../models/user");
const { User } = require("../models/user");

exports.add_comment = [
	body("comment")
		.trim()
		.isLength({ min: 2, max: 3000 })
		.escape()
		.withMessage("Comment must have at least 2 characters and a maximum of 3000."),
	asyncHandler(async (req, res, next) => {
		// Extract the validation errors from a request
		const errors = validationResult(req);

		let photoOwner = null;
		// the following approach provides the most updated photo
		// since req.user.photo at this point might be outdated
		const isUser = await User.findById(req.user._id);
		if (isUser) {
			photoOwner = isUser;
		} else {
			photoOwner = await Admin.findById(req.user._id);
		}

		const comment = new Comment({
			email: req.user.email,
			name: req.user.first_name + " " + req.user.last_name,
			comment: req.body.comment,
			author: req.user._id,
			date: new Date(),
			post: req.body.post, // Blog post were comment will be added
			photo: photoOwner.photo
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
				}))
			};

			res.json({ post: postWithFormattedDates, user: req.user });
		}
	})
];
// Delete specific comments
exports.admin_delete_comment = asyncHandler(async (req, res, next) => {
	// Find comment
	const comment = await Comment.findById(req.params.id);
	// Check if user is an admin
	const isAdmin = await Admin.findById(req.user._id);
	// comment will be deleted only by its author or the blog's admin
	if (comment.author.toString() !== req.user._id.toString() && !isAdmin) {
		res.status(403).send("You are not allowed to delete this comment.");
		return;
	} else {
		// Find post where comment is
		const post = await Post.findById(comment.post);
		// Update post
		post.comments = post.comments.filter((param) => param != req.params.id);
		await Post.findByIdAndUpdate(post._id, post, {});
		const newPost = await Post.findById(post._id).populate("comments");
		// Delete comment
		await Comment.findByIdAndDelete(req.params.id);
		res.json({ post: newPost, user: req.user });
	}
});

exports.update_comment = [
	body("comment")
		.trim()
		.isLength({ min: 2, max: 3000 })
		.escape()
		.withMessage("Comment must have at least 2 characters and a maximum of 3000."),
	asyncHandler(async (req, res, next) => {
		// Extract the validation errors from a request
		const errors = validationResult(req);

		const comment = new Comment({
			_id: req.body._id,
			email: req.user.email,
			name: req.user.first_name + " " + req.user.last_name,
			comment: req.body.comment,
			author: req.user._id,
			date: new Date(),
			post: req.body.post
		});
		if (!errors.isEmpty()) {
			// There are errors, return wrong typed data and errors
			res.json({
				comment: comment,
				errors: errors.array()
			});
			return;
		} else {
			// update comment in database
			await Comment.findByIdAndUpdate(comment._id, comment, {});
			// Find the proper post for the comment
			const post = await Post.findById(comment.post).populate("comments");

			const postWithFormattedDates = {
				...post._doc,
				date: post.virtual_date,
				comments: post.comments.map((comment) => ({
					...comment._doc,
					date: comment.virtual_date
				}))
			};

			res.json({ post: postWithFormattedDates, user: req.user });
		}
	})
];
