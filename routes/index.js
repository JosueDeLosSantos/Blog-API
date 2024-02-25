const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const comment_controller = require('../controllers/commentController');

router.get(
	'/',
	asyncHandler(async (req, res, next) => {
		// GET all post
		const posts = await Post.find().sort({ date: 1 });
		if (posts.length) {
			res.json({ posts });
		} else {
			res.json({ message: 'no posts yet' });
		}
	})
);

router.post('/', comment_controller.comment_post);

module.exports = router;
