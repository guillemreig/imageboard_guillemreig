const path = require("path");
const multer = require("multer"); // npm install multer
const uidSafe = require("uid-safe"); // nmp install uid-safe

const storage = multer.diskStorage({
    destination: path.join(__dirname, "uploads"),
    filename: (req, file, callback) => {
        uidSafe(24).then((uid) => {
            const randomFileName = uid + path.extname(file.originalname); // randomimagename.png
            callback(null, randomFileName);
        });
    },
});

const uploader = multer({
    storage,
    limits: {
        fileSize: 2097152,
    },
});

module.exports = {
    uploader,
};
