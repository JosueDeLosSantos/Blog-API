const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/userController");
const authenticateToken = require("../authenticator");

router.get("/", authenticateToken, user_controller.posts_list);

module.exports = router;
