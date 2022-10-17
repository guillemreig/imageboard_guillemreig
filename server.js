// SETUP
const PORT = process.env.PORT || 8080;

require("dotenv").config();

const path = require("path");

const express = require("express");
const app = express();

const fs = require("fs");

const { uploader } = require("./middleware");
const { DataBrew } = require("aws-sdk");

// database
const db = require("./db");

/// AWS ///
const aws = require("aws-sdk");
let secrets;

if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

// static
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());

// DATA
let images = [];

// START DATABASE REQUEST;
db.getFirstImages().then((data) => {
    console.log("data :", data);
    images = data;
});

// ROUTES
// send first images
app.get("/images", (req, res) => {
    res.json(images); // res.json() = "I send you (this)"
});

// load more images
app.get("/more/:last_id", (req, res) => {
    // Get last id from the request
    const lastId = req.params.last_id;
    console.log("/more/:last_id", lastId);

    db.getMoreImages(lastId).then((data) => {
        console.log("data :", data);
        res.json(data);
    });
});

app.post("/image", uploader.single("file"), (req, res) => {
    console.log("req.file :", req.file);
    console.log("req.body.username :", req.body.username);
    console.log("req.body.title :", req.body.title);
    console.log("req.body.description :", req.body.description);

    const { username, title, description } = req.body;

    if (req.file && username && title && description) {
        const { filename, mimetype, size, path } = req.file;
        let url;

        const promise = s3
            .putObject({
                Bucket: "spicedling",
                ACL: "public-read",
                Key: filename,
                Body: fs.createReadStream(path),
                ContentType: mimetype,
                ContentLength: size,
            })
            .promise();

        promise
            .then(() => {
                // CREATE URL
                url = `https://s3.amazonaws.com/spicedling/${filename}`;

                // DELETE IMAGE FROM LOCAL STORAGE
                fs.unlink(path, function (err) {
                    if (err) {
                        console.error("Error in fs.unlink:", err);
                    } else {
                        console.log("File removed!", path);
                    }
                });

                // PUT DATA IN DATABASE AND GET THE ID AND CREATED_AT
                return db.addImage(username, url, title, description, tags);
            })
            .then((data) => {
                console.log("DATABASE data :", data);

                // PUT NEW DATA IN SERVER
                const newImage = { ...data[0] };
                images.unshift(newImage);
                console.log("UNSHIFT images :", images);

                // SEND OBJECT TO CLIENT
                res.json(newImage);
            })
            .catch((err) => {
                // uh oh
                console.log("err", err);
            });
    } else {
        res.json({
            success: false,
        });
    }
});

// select image
app.get("/image/:id", (req, res) => {
    // Get id from the request
    const id = req.params.id;
    console.log("/image/:id", id);

    // Use id to get image data from the database
    db.getImage(id)
        .then((data) => {
            console.log("DB data :", data);
            res.json(data[0]);
        })
        .catch((err) => {
            console.log("err", err);
        });
});

// post comment
app.post("/comment/:image_id", (req, res) => {
    // Get image_id from the request
    const image_id = req.params.image_id;
    console.log("POST /comment/:image_id", image_id);
});

// get comments
app.get("/comments/:image_id", (req, res) => {
    // Get image_id from the request
    const image_id = req.params.image_id;
    console.log("GET /comment/:image_id", image_id);

    db.getComments(image_id).then((data) => {});
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// INITIALIZATION
app.listen(PORT, () => console.log(`I'm listening on port ${PORT}`));
