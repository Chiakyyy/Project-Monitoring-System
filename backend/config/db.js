const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',      // Your MySQL username
    password: '',      // Your MySQL password
    database: 'angular_db', // The DB name from our SQL script
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convert to promises to use async/await (cleaner code)
module.exports = pool.promise();