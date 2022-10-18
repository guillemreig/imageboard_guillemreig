// SETUP
require("dotenv").config();

// DATABASE
const spicedPg = require("spiced-pg");
const DATABASE_URL = process.env.DATABASE_URL;
const db = spicedPg(DATABASE_URL);

// FUNCTIONS
// Load images
function getFirstImages() {
    const sql = `
    SELECT *
    FROM images
    ORDER BY id DESC
    LIMIT 6
    ;`;
    return db
        .query(sql)
        .then((result) => result.rows)
        .catch((error) => console.log("Error in getFirstImages:", error));
}

function getMoreImages(lastId) {
    const sql = `
    SELECT *, (
        SELECT id FROM images
        ORDER BY id
        LIMIT 1
    ) AS "lowestId"
    FROM images
    WHERE id < $1
    ORDER BY id DESC
    LIMIT 6
    ;`;
    return db
        .query(sql, [lastId])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in getMoreImages:", error));
}

// Login & Register
function checkEmail(email) {
    const sql = `
    SELECT id, email
    FROM users
    WHERE email = $1
    ;`;
    return db
        .query(sql, [email])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in checkEmail:", error));
}

function createUser(username, email, password, picture) {
    const sql = `
        INSERT INTO users (username, email, password, picture)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        ;`;
    return db
        .query(sql, [username, email, password, picture]) // correct way to add data to sql
        .then((result) => result.rows)
        .catch((error) => console.log("Error in createUser:", error));
}

function getUser(email) {
    const sql = `
    SELECT *
    FROM users
    WHERE email = $1
    ;`;
    return db
        .query(sql, [email])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in getUser:", error));
}

// Add image
function addImage(userId, url, title, description, tags) {
    const sql = `
    INSERT INTO images (user_id, url, title, description, tags, likes, comments)
    VALUES ($1, $2, $3, $4, $5, 0, 0)
    RETURNING *
    ;`;
    return db
        .query(sql, [userId, url, title, description, tags])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in addImage:", error));
}

// Select image
function getImage(id) {
    const sql = `
    SELECT images.id, user_id, url, title, description, tags, likes, comments, images.created_at, username, picture
    FROM images
    JOIN users ON images.user_id = users.id
    WHERE images.id = $1
    ;`;
    return db
        .query(sql, [id])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in getImage:", error));
}

// Comments
function getComments(imageId) {
    const sql = `
    SELECT comment, comments.created_at, username, picture
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE image_id = $1
    ORDER BY comments.id DESC
    ;`;
    return db
        .query(sql, [imageId])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in getComments:", error));
}

function addComment(image_id, user_id, comment) {
    const sql = `
    INSERT INTO comments (image_id, user_id, comment)
    VALUES ($1, $2, $3)
    RETURNING *
    ;`;
    return db
        .query(sql, [image_id, user_id, comment])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in addComment:", error));
}

function getComment(id) {
    const sql = `
    SELECT comments.id, comment, comments.created_at, username, picture
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.id = $1
    ;`;
    return db
        .query(sql, [id])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in addComment:", error));
}

// EXPORTS
module.exports = {
    checkEmail,
    createUser,
    getUser,
    getFirstImages,
    getMoreImages,
    addImage,
    getImage,
    getComments,
    addComment,
    getComment,
};
