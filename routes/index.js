const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const comment_controller = require("../controllers/commentController");
const Post = require("../models/post");

router.get(
	"/",
	asyncHandler(async (req, res, next) => {
		// Display a list of all posts
		const posts = await Post.find().sort({ date: 1 }).populate("comments");
		// Update posts dates to a more understandable date
		posts.forEach((_, i) => {
			posts[i] = { ...posts[i]._doc, date: posts[i].virtual_date };
			if (posts[i].comments.length) {
				// If posts contain any comments, update those comment's date
				posts[i].comments.forEach((_, j) => {
					posts[i].comments[j]._doc = {
						...posts[i].comments[j]._doc,
						date: posts[i].comments[j].virtual_date
					};
				});
			}
		});

		if (posts.length) {
			res.json({ posts });
		} else {
			res.json({ message: "no posts" }); // Service unavailable
		}
	})
);
// Post comments on specific posts
router.post("/", comment_controller.comment_post);

module.exports = router;
