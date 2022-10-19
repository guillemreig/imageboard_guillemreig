// SETUP
const PORT = process.env.PORT || 8080;

require("dotenv").config();

const path = require("path");

const express = require("express");
const app = express();

const cookieSession = require("cookie-session");

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
    for (let element of data) {
        element.created_at = element.created_at.toString().split(" GMT")[0];
    }
    images = data;

    console.log("images :", images);
});

// MIDDLEWARE
app.use(
    cookieSession({
        secret: process.env.SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 1, // miliseconds * seconds * minutes * hours * days
        nameSite: true,
    })
);

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
        for (let element of data) {
            element.created_at = element.created_at.toString().split(" GMT")[0];
        }
        console.log("data :", data);
        res.json(data);
    });
});

// registration
app.post("/registration", uploader.single("file"), (req, res) => {
    console.log("REGISTRATION. req.body:", req.body);

    console.log("req.file :", req.file);
    console.log("req.body.username :", req.body.username);
    console.log("req.body.email :", req.body.email);
    console.log("req.body.password :", req.body.password);

    const { username, email, password } = req.body;
    const { filename, mimetype, size, path } = req.file;

    // Check if email already exists
    db.checkEmail(req.body.email)
        .then((data) => {
            if (data.length) {
                throw new Error("Email already in use!");
            } else {
                return undefined;
            }
        })
        .then(() => {
            // UPLOAD PICTURE
            if (req.file && username && email && password) {
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

                return promise;
            }
        })
        .then(() => {
            // CREATE URL
            const picture = `https://s3.amazonaws.com/spicedling/${filename}`;

            // DELETE IMAGE FROM LOCAL STORAGE
            fs.unlink(path, function (err) {
                if (err) {
                    console.error("Error in fs.unlink:", err);
                } else {
                    console.log("File removed!", path);
                }
            });

            // PUT DATA IN DATABASE AND GET THE ID AND CREATED_AT
            return db.createUser(username, email, password, picture);
        })
        .then((data) => {
            for (let element of data) {
                element.created_at = element.created_at.toString().split(" GMT")[0];
            }
            console.log("data[0] :", data[0]);

            req.session = Object.assign(req.session, data[0]);
            console.log("req.session :", req.session);

            // SEND OBJECT TO CLIENT
            res.json(data[0]);
        })
        .catch((err) => {
            console.log("err: ", err);
            res.redirect("/");
        });
});

// login
app.post("/login", uploader.single("file"), (req, res) => {
    console.log("LOG IN. req.body:", req.body);

    db.getUser(req.body.email)
        .then((data) => {
            for (let element of data) {
                element.created_at = element.created_at.toString().split(" GMT")[0];
            }
            console.log("data[0] :", data[0]);

            if (data.length) {
                if (req.body.password == data[0].password) {
                    req.session = Object.assign(req.session, data[0]);
                    console.log("req.session :", req.session);

                    // SEND OBJECT TO CLIENT
                    res.json(data[0]);
                } else {
                    throw new Error("Wrong password!");
                }
            } else {
                throw new Error("No matching email!");
            }
        })
        .catch((err) => {
            console.log("err: ", err);
            res.redirect("/");
        });
});

// logout
app.get("/logout", (req, res) => {
    req.session = null;
    res.json();
});

// add image
app.post("/image", uploader.single("file"), (req, res) => {
    console.log("req.file :", req.file);

    console.log("req.body.title :", req.body.title);
    console.log("req.body.description :", req.body.description);
    console.log("req.body.tags :", req.body.tags);

    console.log("req.session.id :", req.session.id);

    const { title, description, tags } = req.body;
    const userId = req.session.id;

    if (req.file && title && description && userId) {
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
                // CREATE URL
                const url = `https://s3.amazonaws.com/spicedling/${filename}`;

                // DELETE IMAGE FROM LOCAL STORAGE
                fs.unlink(path, function (err) {
                    if (err) {
                        console.error("Error in fs.unlink:", err);
                    } else {
                        console.log("File removed!", path);
                    }
                });

                // PUT DATA IN DATABASE AND GET THE ID AND CREATED_AT
                return db.addImage(userId, url, title, description, tags);
            })
            .then((data) => {
                for (let element of data) {
                    element.created_at = element.created_at.toString().split(" GMT")[0];
                }
                console.log("DATABASE data :", data);

                // PUT NEW DATA IN SERVER
                const newImage = { ...data[0] };
                console.log("newImage :", newImage);

                images.unshift(newImage);
                console.log("UNSHIFT images :", images);

                // SEND OBJECT TO CLIENT
                res.json(newImage);
            })
            .catch((err) => {
                console.log("err", err);
                res.redirect("/");
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
            for (let element of data) {
                element.created_at = element.created_at.toString().split(" GMT")[0];
            }
            console.log("DB data :", data);
            res.json(data[0]);
        })
        .catch((err) => {
            console.log("err", err);
        });
});

// post comment
app.post("/comment/:imageId", uploader.single("file"), (req, res) => {
    console.log("POST /comment/:imageId");

    // Get image_id from the request params
    console.log("req.params :", req.params);
    const { imageId } = req.params;

    // Get user_id from the session
    console.log("req.session.id :", req.session.id);
    const { id } = req.session;

    // Get the comment from the request body
    console.log("req.body :", req.body);
    const { comment } = req.body;

    // Add the comment to the database
    db.addComment(imageId, id, comment)
        .then((data) => {
            console.log("DATABASE 1 data[0] :", data[0]);

            return db.getComment(data[0].id);
        })
        .then((data) => {
            for (let element of data) {
                element.created_at = element.created_at.toString().split(" GMT")[0];
            }
            console.log("DATABASE 2 data[0] :", data[0]);

            // SEND DATA TO CLIENT
            res.json(data[0]);
        })
        .catch((err) => {
            console.log("err", err);
            res.redirect("/");
        });
});

// get comments
app.get("/comments/:imageId", (req, res) => {
    // Get image_id from the request
    const { imageId } = req.params;
    console.log("GET /comment/:imageId", imageId);

    db.getComments(imageId)
        .then((data) => {
            for (let element of data) {
                element.created_at = element.created_at.toString().split(" GMT")[0];
            }
            console.log("DB data :", data);
            res.json(data);
        })
        .catch((err) => {
            console.log("err", err);
        });
});

app.get("*", (req, res) => {
    // req.session = null;
    res.sendFile(path.join(__dirname, "index.html"));
});

// INITIALIZATION
app.listen(PORT, () => console.log(`I'm listening on port ${PORT}`));
