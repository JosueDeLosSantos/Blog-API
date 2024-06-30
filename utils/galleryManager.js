const { updateFiles } = require("../updateFiles");

function galleryManager(req, res, next) {
	const galleryStorage = JSON.parse(req.body.galleryStorage);
	const galleryTrash = JSON.parse(req.body.galleryTrash);

	if (galleryStorage.length > 0 && req.files.gallery) {
		for (const file of galleryStorage) {
			req.files.gallery.push(file);
		}
	} else if (galleryStorage.length > 0 && !req.files.gallery) {
		req.files["gallery"] = galleryStorage;
	}

	if (galleryTrash.length > 0) {
		for (const trash of galleryTrash) {
			updateFiles(undefined, trash);
		}
	}
	next();
}

module.exports = galleryManager;
