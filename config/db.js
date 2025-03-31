const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'tpm',
    database: 't_pm_db',
});

module.exports = db;
