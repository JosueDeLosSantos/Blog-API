const express = require("express");
const router = express.Router();
const authenticateToken = require("../authenticator");
const user_controller = require("../controllers/userController");
const comment_controller = require("../controllers/commentController");

// sign up new admin
router.post("/sign-up", user_controller.user_sign_up);
// log in after signing up
router.post("/log-in", user_controller.user_login_post);

// create new post
router.post("/create-post", authenticateToken, user_controller.post_creator_post);

// delete post
router.delete("/posts/:id", authenticateToken, user_controller.delete_post);
// display single post
router.get("/posts/:id", user_controller.update_post_get);
// update post
router.post("/posts/:id", authenticateToken, user_controller.update_post);
//delete comment
router.delete("/comments/:id", authenticateToken, comment_controller.delete_comment);

module.exports = router;
