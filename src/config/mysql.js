const mysql = require("mysql2");

require("dotenv").config();

const connection = mysql.createConnection({
  host: "ec2-44-202-197-206.compute-1.amazonaws.com",
  user: "fw6aflah",
  password: "Psujy82!",
  database: "fw6aflah_paytickz",
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  console.log("youre now connected db mysql");
});
module.exports = connection;
