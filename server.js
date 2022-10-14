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
// var images = [
//     {
//         url: "https://s3.amazonaws.com/imageboard/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg",
//         username: "funkychicken",
//         title: "Welcome to Spiced and the Future!",
//         description: "This photo brings back so many great memories.",
//     },
//     {
//         url: "https://s3.amazonaws.com/imageboard/wg8d94G_HrWdq7bU_2wT6Y6F3zrX-kej.jpg",
//         username: "discoduck",
//         title: "Elvis",
//         description: "We can't go on together with suspicious minds.",
//     },
//     {
//         url: "https://s3.amazonaws.com/imageboard/XCv4AwJdm6QuzjenFPKJocpipRNNMwze.jpg",
//         username: "discoduck",
//         title: "To be or not to be",
//         description: "That is the question.",
//     },
// ];

// STARTU DATABASE REQUEST;
var images = [];
db.getAllImages().then((data) => {
    console.log("data :", data);
    images = data;
});

// ROUTES
app.get("/images", (req, res) => {
    res.json(images);
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
                return db.addImage(url, username, title, description);
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

// specific image
app.get("/image/:id", (req, res) => {
    console.log("/image/:id");
    // Get id from the request
    const id = req.params.id;
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

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// INITIALIZATION
app.listen(PORT, () => console.log(`I'm listening on port ${PORT}`));
