const fs = require("fs");
const path = require("path");

// This function deletes unnecessary files an returns updated metadata
// for newly added files.

module.exports = (file, trash) => {
	const filePath = path.join(__dirname, `public/uploads/${trash}`);

	fs.unlink(filePath, (err) => {
		if (err) {
			console.error(err);
		} else {
			console.log(`File ${trash} deleted successfully.`);
		}
	});

	return {
		filename: file.filename,
		originalname: file.originalname,
		mimetype: file.mimetype,
		path: file.path,
		size: file.size
	};
};
