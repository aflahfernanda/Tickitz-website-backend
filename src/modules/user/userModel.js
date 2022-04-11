const { hash } = require("bcrypt");
const connection = require("../../config/mysql");

module.exports = {
  getUserByUserId: (id) =>
    new Promise((resolve, reject) => {
      connection.query("SELECT * FROM user WHERE id=?", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
  updateProfile: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query("UPDATE user SET? WHERE id=?", [data, id], (error) => {
        if (!error) {
          const newResult = {
            id,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
  updateImage: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user SET ? WHERE id="${id}"`,
        data,
        (error, result) => {
          if (!error) {
            const newResult = {
              id,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getUserByPassword: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT password FROM user WHERE id=?",
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  updatePassword: (id, hash, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user SET password='${hash}' WHERE id=${id}`,
        (error) => {
          if (!error) {
            const newResult = {
              id,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  closeAccount: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query("DELETE FROM user WHERE id=?", id, (error) => {
        if (!error) {
          const newResult = {
            id,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
};
