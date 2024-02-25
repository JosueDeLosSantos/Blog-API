const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const comment_controller = require('../controllers/commentController');
const Post = require('../models/post');

router.get(
	'/',
	asyncHandler(async (req, res, next) => {
		// Display a list of all posts
		const posts = await Post.find()
			.sort({ date: 1 })
			.populate('comments');
		if (posts.length) {
			res.json({ posts });
		} else {
			res.json({ message: 'There are no posts' });
		}
	})
);
// Post comments on specific posts
router.post('/', comment_controller.comment_post);

module.exports = router;
