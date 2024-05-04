const fs = require("fs");
const path = require("path");

/**
 * Deletes an unnecessary file and returns updated metadata for a newly added file.
 *
 * @param {Object} file - The file to be deleted and updated.
 * @param {string} trash - The name of the file to be deleted.
 * @return {Object} The updated metadata of the newly added file.
 */
module.exports = (file, trash) => {
	// unnecessary file's path
	const filePath = path.join(__dirname, `public/uploads/${trash}`);
	// deletion of unnecessary file
	fs.unlink(filePath, (err) => {
		if (err) {
			console.error(err);
		} else {
			console.log(`File ${trash} deleted successfully.`);
		}
	});

	if (file) {
		// updated metadata
		return {
			filename: file.filename,
			originalname: file.originalname,
			mimetype: file.mimetype,
			path: file.path,
			size: file.size
		};
	}
};
