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
var images = [
    {
        url: "https://s3.amazonaws.com/imageboard/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg",
        username: "funkychicken",
        title: "Welcome to Spiced and the Future!",
        description: "This photo brings back so many great memories.",
    },
    {
        url: "https://s3.amazonaws.com/imageboard/wg8d94G_HrWdq7bU_2wT6Y6F3zrX-kej.jpg",
        username: "discoduck",
        title: "Elvis",
        description: "We can't go on together with suspicious minds.",
    },
    {
        url: "https://s3.amazonaws.com/imageboard/XCv4AwJdm6QuzjenFPKJocpipRNNMwze.jpg",
        username: "discoduck",
        title: "To be or not to be",
        description: "That is the question.",
    },
];

// DATABASE;
// db.getAllImages().then((data) => {
//     images = { ...data };
// });

// ROUTES
app.get("/images", (req, res) => {
    res.json(images);
});

app.post("/images", uploader.single("file"), (req, res) => {
    console.log("req.file :", req.file);
    // 1. validation
    // 2. get the file from the request
    // 3. save the file somewhere
    // 4. respond to client
    // let { filename, mimetype, size, path } = req.file;

    // path = `/uploads/${req.file.filename}`;

    // newImg = { title: filename, url: path };

    // images.push(newImg);

    // console.log("images :", images);

    // res.json(images);
    if (req.file) {
        const { filename, mimetype, size, path } = req.file;

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
                // it worked!!!
                console.log("It worked!");
                // set image path to internet path

                internetPath = `https://s3.amazonaws.com/spicedling/${filename}`;
                console.log("internetPath :", internetPath);

                res.json({
                    success: true,
                    path: internetPath,
                    // path: `/uploads/${req.file.filename}`,
                });
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

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// INITIALIZATION
app.listen(PORT, () => console.log(`I'm listening on port ${PORT}`));
