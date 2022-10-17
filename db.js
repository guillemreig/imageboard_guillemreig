// SETUP
require("dotenv").config();

// DATABASE
const spicedPg = require("spiced-pg");
const DATABASE_URL = process.env.DATABASE_URL;
const db = spicedPg(DATABASE_URL);

// FUNCTIONS
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

function selectLastId() {
    const sql = `
    SELECT id
    FROM images
    ORDER BY id ASC
    LIMIT 1
    ;`;
    return db
        .query(sql)
        .then((result) => result.rows)
        .catch((error) => console.log("Error in getLastId:", error));
}

function addImage(user_id, url, title, description, tags) {
    const sql = `
    INSERT INTO images (user_id, url, title, description, tags, likes, comments)
    VALUES ($1, $2, $3, $4, $5, 0, 0)
    RETURNING *
    ;`;
    return db
        .query(sql, [user_id, url, title, description, tags])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in addImage:", error));
}

function getImage(id) {
    const sql = `
    SELECT *
    FROM images
    WHERE id = $1
    ;`;
    return db
        .query(sql, [id])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in getImage:", error));
}

function addComment() {}

function getComments(image_id) {
    const sql = `
    SELECT *
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE image_id = $1
    ORDER BY id DESC
    ;`;
    return db
        .query(sql, [image_id])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in getComments:", error));
}

// EXPORTS
module.exports = {
    getFirstImages,
    getMoreImages,
    addImage,
    getImage,
    getComments,
};
