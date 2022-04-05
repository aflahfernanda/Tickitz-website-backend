const connection = require("../../config/mysql");

module.exports = {
  getCountMovie: () =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT (*) AS total FROM movie",
        (error, result) => {
          if (!error) {
            resolve(result[0].total);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),

  getAllMovie: (limit, offset, searchName, sort, searchRelease) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM movie WHERE name LIKE '%${searchName}%' OR releaseDate LIKE '%${searchRelease}%' ORDER BY ${sort} LIMIT ? OFFSET ?`,
        [limit, offset],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getMovieById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM movie WHERE id=?",
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
  createMovie: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT into movie SET?",
        data,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
      console.log(query.sql);
    }),
  updateMovie: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query("UPDATE movie SET? WHERE id=?", [data, id], (error) => {
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
  deleteMovie: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query("DELETE FROM movie WHERE id=?", id, (error) => {
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
