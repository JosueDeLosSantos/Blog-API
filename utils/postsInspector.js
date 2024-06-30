const he = require("he");

function postsUrlCorrector(post, gallery, serverAddress) {
	const decodedPost = he.decode(post);
	const regex = /data-image-\d+(?=["])/g;
	let matchIndex = 0;
	// replaces temporal URLs with the real ones
	const postWithRealUrls = decodedPost.replace(
		regex,
		() => `${serverAddress}${gallery[matchIndex++].path}`
	);

	return postWithRealUrls;
}

module.exports = postsUrlCorrector;
