const he = require("he");

function postsUrlCorrector(post, gallery) {
	const decodedPost = he.decode(post);
	const regex = /data:image-\$#\d+#\$/g;
	let matchIndex = 0;
	// replaces temporal URLs with the real ones
	const postWithRealUrls = decodedPost.replace(
		regex,
		() => `http://localhost:3000/${gallery[matchIndex++].path}`
	);
	// returns a new content without Base64 encoded images but with urls instead
	console.log(postWithRealUrls);
	return postWithRealUrls;
}

module.exports = postsUrlCorrector;
