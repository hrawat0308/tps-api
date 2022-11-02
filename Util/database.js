//This file include code for database connection

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: process.env.DB_NAME,
    password: process.env.SQL_DB_PASSWORD
});

module.exports = pool.promise();