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
    ;`;
    return db
        .query(sql)
        .then((result) => result.rows)
        .catch((error) => console.log("Error in getAllImages:", error));
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

// EXPORTS
module.exports = {
    getAllImages,
    addImage,
    getImage,
};
