const asyncHandler = require("express-async-handler");
const { body, check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer"); // enables file uploading
const upload = multer({ dest: "./public/uploads/" }); // The folder to which the file has been saved
const { updateFiles } = require("../updateFiles");
const { Admin } = require("../models/user");
const { User } = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

exports.admin_sign_up = [
	// Validate and sanitize fields.
	body("first_name")
		.trim()
		.isLength({ min: 2 })
		.escape()
		.withMessage("First name must be specified.")
		.isAlpha()
		.withMessage("First name has non-alpha characters."),
	body("last_name")
		.trim()
		.isLength({ min: 2 })
		.escape()
		.withMessage("Last name must be specified."),
	body("email")
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage("email must be specified.")
		.isEmail()
		.withMessage("A valid email must be specified"),
	body("username")
		.trim()
		.isLength({ min: 5 })
		.escape()
		.withMessage("username must have at least 5 characters.")
		.isAlphanumeric()
		.withMessage("username has non-alphanumeric characters.")
		.custom(async (value) => {
			const user = await Admin.findOne({ username: `${value}` });
			if (user) {
				throw new Error("Username already in use");
			}
		}),
	body("password")
		.trim()
		.isLength({ min: 8 })
		.escape()
		.withMessage("Password must have at least 8 characters.")
		.isAlphanumeric()
		.withMessage("Password is not alphanumeric."),
	body("passwordConfirmation")
		.custom((value, { req }) => {
			return value === req.body.password;
		})
		.withMessage("Passwords do not match"),
	// Process request after validation and sanitization.
	asyncHandler(async (req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		// Create User object with escaped and trimmed data
		const user = new Admin({
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			username: req.body.username,
			password: req.body.password
		});
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		if (!errors.isEmpty()) {
			res.json({
				user: user,
				errors: errors.array()
			});
			return;
		} else {
			// Data from form is valid.
			/* the following condition makes sure there's only one admin in the blog */
			if (await checkIfAdminsExist()) {
				res.status(401).json({ message: "An admin already exists" });
			} else {
				// store hashedPassword in Db
				user.password = hashedPassword;
				await user.save();
				res.json({
					message: "Successful sign up, you are now the admin of this blog"
				});
			}
		}
	})
];

exports.user_sign_up = [
	// Validate and sanitize fields.
	body("first_name")
		.trim()
		.isLength({ min: 2 })
		.escape()
		.withMessage("First name must be specified.")
		.isAlpha()
		.withMessage("First name has non-alpha characters."),
	body("last_name")
		.trim()
		.isLength({ min: 2 })
		.escape()
		.withMessage("Last name must be specified."),
	body("email")
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage("email must be specified.")
		.isEmail()
		.withMessage("A valid email must be specified"),
	body("username")
		.trim()
		.isLength({ min: 5 })
		.escape()
		.withMessage("username must have at least 5 characters.")
		.isAlphanumeric()
		.withMessage("username has non-alphanumeric characters.")
		.custom(async (value) => {
			const user = await User.findOne({ username: `${value}` });
			if (user) {
				throw new Error("Username already in use");
			}
		}),
	body("password")
		.trim()
		.isLength({ min: 8 })
		.escape()
		.withMessage("Password must have at least 8 characters.")
		.isAlphanumeric()
		.withMessage("Password is not alphanumeric."),
	body("passwordConfirmation")
		.custom((value, { req }) => {
			return value === req.body.password;
		})
		.withMessage("Passwords do not match"),
	// Process request after validation and sanitization.
	asyncHandler(async (req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		// Create User object with escaped and trimmed data
		const user = new User({
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			username: req.body.username,
			password: req.body.password
		});
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		if (!errors.isEmpty()) {
			res.json({
				user: user,
				errors: errors.array()
			});
			return;
		} else {
			// Data from form is valid.
			// store hashedPassword in Db
			user.password = hashedPassword;
			await user.save();
			res.json({
				message: "Successful sign up"
			});
		}
	})
];

exports.admin_login = [
	body("username")
		.trim()
		.isLength({ min: 5 })
		.escape()
		.withMessage("Username must have at least 5 characters.")
		.isAlphanumeric()
		.withMessage("username has non-alphanumeric characters."),
	body("password")
		.trim()
		.isLength({ min: 6 })
		.escape()
		.withMessage("Password must have at least 6 characters.")
		.isAlphanumeric()
		.withMessage("Password most be alphanumeric."),
	asyncHandler(async (req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		// There are errors. Render form again with sanitized values/errors messages.
		if (!errors.isEmpty()) {
			res.json({
				username: req.body.username,
				password: req.body.password,
				errors: errors.array()
			});
			return;
		}

		const user = await Admin.find({
			username: req.body.username
		});

		if (user.length) {
			// Transform user into js object
			const newUser = JSON.parse(JSON.stringify(user))[0];
			// Get user's hashed password
			const passwordHash = newUser.password;
			// Decode hashed password and authenticate passwords
			const match = await bcrypt.compare(req.body.password, passwordHash);

			if (match) {
				// If passwords match generate accessToken
				const accessToken = jwt.sign(
					newUser,
					`${process.env.ACCESS_TOKEN_SECRET}`,
					{
						expiresIn: "24h"
					}
				);
				res.json({ accessToken: accessToken });
			} else {
				res.json({ message: "Username or Password is incorrect" });
			}
		} else {
			res.json({ message: "Username or Password is incorrect" });
		}
	})
];

exports.user_login = [
	body("username")
		.trim()
		.isLength({ min: 5 })
		.escape()
		.withMessage("Username must have at least 5 characters.")
		.isAlphanumeric()
		.withMessage("username has non-alphanumeric characters."),
	body("password")
		.trim()
		.isLength({ min: 6 })
		.escape()
		.withMessage("Password must have at least 6 characters.")
		.isAlphanumeric()
		.withMessage("Password most be alphanumeric."),
	asyncHandler(async (req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		// There are errors. Render form again with sanitized values/errors messages.
		if (!errors.isEmpty()) {
			res.json({
				username: req.body.username,
				password: req.body.password,
				errors: errors.array()
			});
			return;
		}

		const user = await User.find({
			username: req.body.username
		});

		if (user.length) {
			// Transform user into js object
			const newUser = JSON.parse(JSON.stringify(user))[0];
			// Get user's hashed password
			const passwordHash = newUser.password;
			// Decode hashed password and authenticate passwords
			const match = await bcrypt.compare(req.body.password, passwordHash);

			if (match) {
				// If passwords match generate accessToken
				const accessToken = jwt.sign(
					newUser,
					`${process.env.ACCESS_TOKEN_SECRET}`,
					{
						expiresIn: "1h"
					}
				);
				res.json({ accessToken: accessToken });
			} else {
				res.json({ message: "Username or Password is incorrect" });
			}
		} else {
			res.json({ message: "Username or Password is incorrect" });
		}
	})
];

exports.create_post = [
	upload.single("file"), // this middleware always goes before any express validator, if not it throws an error
	body("title")
		.trim()
		.isLength({ min: 10 })
		.escape()
		.withMessage("Title must have at least 10 characters."),
	body("description")
		.trim()
		.isLength({ min: 10 })
		.escape()
		.withMessage("Description must have at least 10 characters."),
	body("post")
		.trim()
		.isLength({ min: 10 })
		.escape()
		.withMessage("Post must have at least 10 characters."),
	body("author")
		.trim()
		.isLength({ min: 5 })
		.escape()
		.withMessage("Author name should have at least 5 characters."),
	check("file").custom((_, { req }) => {
		if (!req.file) {
			// No file uploaded
			return Promise.reject("Please select an image file");
		}

		const allowedMimeTypes = ["image/jpeg", "image/png"];
		if (!allowedMimeTypes.includes(req.file.mimetype)) {
			// clean trash first
			updateFiles(undefined, req.file.filename);
			return Promise.reject("Only JPEG and PNG images are allowed");
		}

		return true; // Validation successful
	}),
	asyncHandler(async (req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		// Create Posts object with escaped and trimmed data
		let post = new Post({
			title: req.body.title,
			description: req.body.description,
			post: req.body.post,
			date: new Date(),
			author: req.body.author,
			comments: [],
			// multer files's info can be accessed through req.file not req.body.file
			file: req.file
				? {
						filename: req.file.filename,
						originalname: req.file.originalname,
						mimetype: req.file.mimetype,
						path: req.file.path,
						size: req.file.size
				  }
				: null
		});

		if (!errors.isEmpty()) {
			// if file was uploaded, clean trash
			if (req?.file?.filename) {
				updateFiles(undefined, req.file.filename);
			}
			// returns post object to correct mistakes in the front end
			res.json({
				post: post,
				errors: errors.array()
			});
			return;
		} else {
			// Data from form is valid.
			// Save post in database
			await post.save();
			// format date for the front end
			post = { ...post._doc, date: post.virtual_date };
			res.json({ post });
		}
	})
];

exports.update_post = [
	upload.single("file"), // this middleware always goes before any express validator, if not it throws an error
	body("title")
		.trim()
		.isLength({ min: 10 })
		.escape()
		.withMessage("Title must have at least 10 characters."),
	body("description")
		.trim()
		.isLength({ min: 10 })
		.escape()
		.withMessage("Description must have at least 10 characters."),
	body("post")
		.trim()
		.isLength({ min: 10 })
		.escape()
		.withMessage("Post must have at least 10 characters."),
	body("author")
		.trim()
		.isLength({ min: 5 })
		.escape()
		.withMessage("Author name should have at least 5 characters."),
	check("file").custom((_, { req }) => {
		if (req.file) {
			const allowedMimeTypes = ["image/jpeg", "image/png"];
			if (!allowedMimeTypes.includes(req.file.mimetype)) {
				// clean trash first
				updateFiles(undefined, req.file.filename);
				// set file to null to avoid req.body.trash to be deleted
				// req.body.trash should only be deleted if a valid file is selected
				req.file = null;
				return Promise.reject("Only JPEG and PNG images are allowed");
			}
		}

		return true; // Validation successful
	}),
	asyncHandler(async (req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create Posts object with escaped and trimmed data
		let post = new Post({
			_id: req.params.id,
			title: req.body.title,
			description: req.body.description,
			post: req.body.post,
			date: new Date(),
			author: req.body.author,
			comments: req.body.comments,
			// if a file is selected a new file will be uploaded
			// and the old one will be deleted from the server.
			// if no file is selected it will return undefined
			// which will make mongoose preserve the old value in the document.
			file: req.file ? updateFiles(req.file, req.body.trash) : req.body.file
		});

		if (!errors.isEmpty()) {
			// if file was uploaded, clean trash
			if (req?.file?.filename) {
				updateFiles(undefined, req.file.filename);
			}
			res.json({
				post: post,
				errors: errors.array()
			});
			return;
		} else {
			// Data from form is valid.
			// Save post in database
			await Post.findByIdAndUpdate(req.params.id, post);

			// format date for the front end
			post = { ...post._doc, date: post.virtual_date };
			res.json({ post });
		}
	})
];

exports.posts_list = asyncHandler(async (req, res, next) => {
	// Display a list of all posts
	const posts = await postList();

	if (posts.length) {
		if (req.statusCode) {
			res.status(req.statusCode).json({ posts });
		} else {
			res.json({ posts });
		}
	} else {
		if (req.statusCode) {
			res.status(req.statusCode).json({ message: "no posts" });
		} else {
			res.json({ message: "no posts" });
		}
	}
});

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
	// Delete post's image from the server if there's any
	updateFiles(undefined, post.file.filename);
	// return deleted file to the front end
	res.json({ post });
});

exports.get_post = asyncHandler(async (req, res, next) => {
	let post = await Post.findById(req.params.id).populate("comments");
	// Update post date to a more understandable date
	post = { ...post._doc, date: post.virtual_date };

	if (post.comments.length) {
		// If post contain any comments, update those comment's date
		// to a more understandable date
		post.comments.forEach((_, i) => {
			post.comments[i]._doc = {
				...post.comments[i]._doc,
				date: post.comments[i].virtual_date
			};
		});
	}

	if (post === null) {
		// No results.
		const err = new Error("Post not found");
		err.status = 404;
		return next(err);
	}

	if (req.statusCode) {
		res.status(req.statusCode).json({ post });
	} else {
		res.json({ post });
	}
});

async function postList() {
	// Display a list of all posts
	const posts = await Post.find({}, { post: 0, comments: 0 }).sort({ date: 1 });

	posts.forEach((_, i) => {
		// Update posts dates to a more understandable date
		posts[i] = { ...posts[i]._doc, date: posts[i].virtual_date };
	});

	return posts;
}

async function checkIfAdminsExist() {
	try {
		const userCount = await Admin.countDocuments({});
		return userCount > 0;
	} catch (error) {
		console.error(error);
		return false;
	}
}
