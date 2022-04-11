const connection = require("../../config/mysql");

module.exports = {
  register: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO user SET?", data, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data,
          };
          delete newResult.password;
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
  getEmail: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT email FROM user WHERE email="${email}"`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getActivation: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user SET status= 'active' WHERE email="${email}"`,
        (error, result) => {
          if (!error) {
            const newResult = "email active";
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getUserByEmail: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM user WHERE email=?",
        email,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getUserByPassword: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT password FROM user WHERE email=?",
        email,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
};
