const mysql = require('mysql2');

require('dotenv').config();

const db = mysql.createConnection({
  connectionLimit: 10,
  host:process.env.DB_HOST,
  port:process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
  database: 'employee_tracker'
});

module.exports = db;


