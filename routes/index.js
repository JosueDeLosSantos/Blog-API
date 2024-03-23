const express = require("express");
const router = express.Router();
// const asyncHandler = require("express-async-handler");
const comment_controller = require("../controllers/commentController");
const user_controller = require("../controllers/userController");
// const Post = require("../models/post");

router.get("/", user_controller.posts_list);
// Post comments on specific posts
router.post("/", comment_controller.comment_post);

module.exports = router;
