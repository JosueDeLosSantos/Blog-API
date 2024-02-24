const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const user_controller = require('../controllers/userController');

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
	const authHeader = req.headers['authorization'];

	const token = authHeader && authHeader.split(' ')[1];
	if (token == null) return res.sendStatus(401); // 'Unauthorized';

	jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET,
		(err, user) => {
			if (err) return res.sendStatus(403); // 'Forbidden';
			req.user = user;
			next();
		}
	);
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

router.get('/sign-up', (req, res, next) => {
	res.json({ message: 'sign up get request' });
});

router.post('/sign-up', user_controller.create_user_post);

router.post('/log-in', user_controller.user_login_post);
router.get('/log-in', authenticateToken, (req, res, next) => {
	res.json({ message: 'Successfully signed in' });
});

router.post(
	'/create-post',
	authenticateToken,
	user_controller.post_creator_post
);
router.get(
	'/post-list',
	authenticateToken,
	user_controller.posts_list
);

module.exports = router;
