const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

exports.create_user_post = [
	// Validate and sanitize fields.
	body('first_name')
		.trim()
		.isLength({ min: 2 })
		.escape()
		.withMessage('First name must be specified.')
		.isAlpha()
		.withMessage('First name has non-alpha characters.'),
	body('last_name')
		.trim()
		.isLength({ min: 2 })
		.escape()
		.withMessage('Last name must be specified.'),
	body('username')
		.trim()
		.isLength({ min: 2 })
		.escape()
		.withMessage('username must be specified.')
		.isAlphanumeric()
		.withMessage(
			'username has non-alphanumeric characters.'
		),
	body('password')
		.trim()
		.isLength({ min: 6 })
		.escape()
		.withMessage('password must be specified.')
		.isAlphanumeric()
		.withMessage(
			'Password has non-alphanumeric characters.'
		),
	body('passwordConfirmation')
		.custom((value, { req }) => {
			return value === req.body.password;
		})
		.withMessage('Passwords do not match'),
	// Process request after validation and sanitization.
	asyncHandler(async (req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		// Create User object with escaped and trimmed data
		const user = new User({
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			username: req.body.username,
			password: req.body.password,
		});
		const hashedPassword = await bcrypt.hash(
			req.body.password,
			10
		);
		if (!errors.isEmpty()) {
			res.json({
				user: user,
				errors: errors.array(),
			});
			return;
		} else {
			// Data from form is valid.
			// store hashedPassword in Db
			user.password = hashedPassword;
			await user.save();
			res.sendStatus(200); //OK
		}
	}),
];

exports.user_login_post = [
	body('username')
		.trim()
		.isLength({ min: 2 })
		.escape()
		.withMessage('username must be specified.')
		.isAlphanumeric()
		.withMessage(
			'username has non-alphanumeric characters.'
		),
	body('password')
		.trim()
		.isLength({ min: 6 })
		.escape()
		.withMessage('password must be specified.')
		.isAlphanumeric()
		.withMessage(
			'Password has non-alphanumeric characters.'
		),
	asyncHandler(async (req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		// There are errors. Render form again with sanitized values/errors messages.
		if (!errors.isEmpty()) {
			res.json({
				username: req.body.username,
				password: req.body.password,
				errors: errors.array(),
			});
			return;
		}

		const user = await User.find({
			username: req.body.username,
		});
		// Transform user into js object
		const newUser = JSON.parse(JSON.stringify(user))[0];
		// Get user's hashed password
		const passwordHash = newUser.password;
		// Decode hashed password and authenticate passwords
		const match = await bcrypt.compare(
			req.body.password,
			passwordHash
		);

		if (match) {
			// If passwords match generate accessToken
			const accessToken = jwt.sign(
				newUser,
				`${process.env.ACCESS_TOKEN_SECRET}`,
				{ expiresIn: '24h' }
			);
			res.json({ accessToken: accessToken });
		} else {
			res.sendStatus(401); // Unauthorized
		}
	}),
];

exports.post_creator_post = [
	body('title')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('Title must be specified.'),
	body('post')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('Post must be specified.'),
	asyncHandler(async (req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		// Create Posts object with escaped and trimmed data
		const post = new Post({
			title: req.body.title,
			post: req.body.post,
			date: new Date(),
			author: req.user._id,
			comments: [],
		});
		if (!errors.isEmpty()) {
			res.json({
				post: post,
				errors: errors.array(),
			});
			return;
		} else {
			// Data from form is valid.
			// Save post in database
			await post.save();
			res.sendStatus(200); //OK
		}
	}),
];

exports.posts_list = asyncHandler(async (req, res, next) => {
	// Display a list of all posts
	const posts = await Post.find()
		.sort({ date: 1 })
		.populate('comments');
	if (posts) {
		res.json({ posts });
	} else {
		return res.sendStatus(503); // Service unavailable
	}
});

// Delete specific posts
exports.delete_post = asyncHandler(async (req, res, next) => {
	// Find post
	const post = await Post.findById(req.params.id);
	if (post.comments.length) {
		// Query all comments by their IDs
		const promises = post.comments.map(async (comment) => {
			return await Comment.findById(comment);
		});
		const store = await Promise.all(promises);
		// Delete each comment by their IDs
		for (const comment of store) {
			await Comment.findByIdAndDelete(comment._id);
		}
	}
	// Delete the post
	await Post.findByIdAndDelete(req.params.id);
	res.sendStatus(200); //OK
});