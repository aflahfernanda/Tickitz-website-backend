const mysql = require("mysql2");

require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  console.log("youre now connected db mysql");
});
module.exports = connection;
