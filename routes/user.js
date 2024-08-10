const express = require("express");
const router = express.Router();
const authenticateToken = require("../utils/authenticator");
const user_controller = require("../controllers/userController");
const comment_controller = require("../controllers/commentController");

// admin routes

router.get("/admin/profile", authenticateToken, user_controller.get_admin);

router.post("/admin/sign-up", user_controller.admin_sign_up);

router.post("/admin/log-in", user_controller.admin_login);

router.post("/create-post", authenticateToken, user_controller.create_post);

router.put("/admin/profile", authenticateToken, user_controller.admin_update);

router.put("/admin/profile/photo", authenticateToken, user_controller.admin_photo_update);

router.put("/posts/:id", authenticateToken, user_controller.update_post);

router.delete("/posts/:id", authenticateToken, user_controller.delete_post);

// users routes

router.get("/profile", authenticateToken, user_controller.get_user);

router.post("/sign-up", user_controller.user_sign_up);

router.post("/log-in", user_controller.user_login);

router.put("/profile", authenticateToken, user_controller.user_update);

router.put("/profile/photo", authenticateToken, user_controller.user_photo_update);

// both user's and admins can access routes below

router.get("/posts/:id", authenticateToken, user_controller.get_post);

router.post("/comments", authenticateToken, comment_controller.add_comment);

router.put("/comments", authenticateToken, comment_controller.update_comment);

router.delete("/comments/:id", authenticateToken, comment_controller.delete_comment);

module.exports = router;
