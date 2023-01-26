const mysql = require("mysql");
require("dotenv").config();

console.log("user", process.env.USER);
const connection = mysql.createConnection({
  port: process.env.PORT,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
});

connection.connect();

function asyncMySQL(query, vars) {
  return new Promise((resolve, reject) => {
    connection.query(query, vars, (error, results) => {
      if (error) {
        reject(error);
      }

      resolve(results);
    });
  });
}

module.exports = asyncMySQL;
