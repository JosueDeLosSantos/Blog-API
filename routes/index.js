const express = require("express");
const router = express.Router();

const comment_controller = require("../controllers/commentController");
const user_controller = require("../controllers/userController");
const authenticateToken = require("../authenticator");

router.get("/", authenticateToken, user_controller.posts_list);
// comment on specific posts
router.post("/comments", comment_controller.comment_post);

module.exports = router;
