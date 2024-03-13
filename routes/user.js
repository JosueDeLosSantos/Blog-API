const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const user_controller = require("../controllers/userController");
const comment_controller = require("../controllers/commentController");

/* The following middleware is executed on all protected routes
	example:
	app.get('/posts', authenticateToken, (req, res) => {
		console.log(req);
		res.json(
			posts.filter((post) => post.username === req.user.name)
		);
});
*/
function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];

	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return res.sendStatus(401); // 'Unauthorized';

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403); // 'Forbidden';
		req.user = user;
		next();
	});
}

/* 
***Client-side Usage
***JavaScript***

function makeRequest(url, method) {
    const jwtToken = localStorage.getItem('token');
    const headers = {};
    if (jwtToken) {
        headers['Authorization'] = `Bearer ${jwtToken}`;
    }
    return fetch(url, {
        method: 'POST', // or any other HTTP method
        mode: 'cors',
        headers: headers,
        // ... (other request options)
    });
}

 */

// sign up new admin
router.post("/sign-up", user_controller.user_sign_up);
// log in after signing up
router.post("/log-in", user_controller.user_login_post);

// router.get("/create-post", user_controller.post_creator_get);

// create new post
router.post("/create-post", authenticateToken, user_controller.post_creator_post);
// display all posts
router.get("/posts", authenticateToken, user_controller.posts_list);
// delete post
router.delete("/posts/:id", authenticateToken, user_controller.delete_post);
// manage posts update
router.get("/posts/:id", authenticateToken, user_controller.update_post_get);
router.post("/posts/:id", authenticateToken, user_controller.update_post);
//delete comment
router.delete("/comments/:id", authenticateToken, comment_controller.delete_comment);

module.exports = router;
