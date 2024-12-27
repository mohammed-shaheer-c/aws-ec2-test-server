const mysql = require('mysql2');


const dbConnection  = mysql.createConnection({
    host: process.env.DB_HOST_NAME,  // Replace with your MySQL host
    user: process.env.DB_USER,       // Replace with your MySQL username
    password: process.env.DB_PASSWORD,       // Replace with your MySQL password
    database: 'image_upload', // Replace with your database name
  });

  dbConnection .connect((err) => {
    if (err) {
      console.error('Database connection failed:', err);
      process.exit(1);
    }
    console.log('Connected to MySQL database');
  });

module.exports = {dbConnection }