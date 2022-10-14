// SETUP
require("dotenv").config();

// DATABASE
const spicedPg = require("spiced-pg");
const DATABASE_URL = process.env.DATABASE_URL;
const db = spicedPg(DATABASE_URL);

// FUNCTIONS
function getAllImages() {
    const sql = `
    SELECT *
    FROM images
    ORDER BY id DESC
    ;`;
    return db
        .query(sql)
        .then((result) => result.rows)
        .catch((error) => console.log("Error in getAllImages:", error));
}

function addImage(url, username, title, description) {
    const sql = `
    INSERT INTO images (url, username, title, description)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    ;`;
    return db
        .query(sql, [url, username, title, description])
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

// EXPORTS
module.exports = {
    getAllImages,
    addImage,
    getImage,
};
