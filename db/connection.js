const mysql = require('mysql2/promise');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env.pass,
        database: 'employee_trackerDB'
    }
)

module.exports = db;