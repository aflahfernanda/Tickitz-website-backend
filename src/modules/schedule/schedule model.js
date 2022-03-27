const connection = require("../../config/mysql");

module.exports = {
  getCountSchedule: () =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT (*) AS total FROM schedule",
        (error, result) => {
          if (!error) {
            resolve(result[0].total);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getAllSchedule: (limit, offset, searchLocation, searchMovieId) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT schedule.id,movie.name,movie.category,movie.synopsis,schedule.movieId,schedule.premiere,schedule.price,schedule.location,schedule.dateStart,schedule.dateEnd,schedule.time FROM schedule JOIN movie ON movie.id=schedule.movieId WHERE location LIKE '%${searchLocation}%' OR movieId LIKE '${searchMovieId}' ORDER BY movieId LIMIT ? OFFSET ?`,
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
  getScheduleById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM schedule WHERE id=?",
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
  createSchedule: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT into schedule SET?",
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
  updateSchedule: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE schedule SET? WHERE id=?",
        [data, id],
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
  deleteMovie: (id) =>
    new Promise((resolve, reject) => {
      connection.query("DELETE FROM movie WHERE id=?", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
};
