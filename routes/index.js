const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/userController");

// visitors routes
router.get("/", user_controller.posts_list);
router.get("/visitor/post/:id", user_controller.get_post);

module.exports = router;
