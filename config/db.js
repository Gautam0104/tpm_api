const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 't-pm123',
    database: 't_pm_db',
});

module.exports = db;
