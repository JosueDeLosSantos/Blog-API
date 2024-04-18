const jwt = require("jsonwebtoken");

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
	if (token == null) {
		if (req.url !== "/") {
			return res.sendStatus(401); // 'Unauthorized';
		} else {
			req.statusCode = 401;
		}
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err && req.url !== "/") return res.sendStatus(403); // 'Forbidden';
		req.user = user;
		next();
	});
}

module.exports = authenticateToken;

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
