const connection = require("../../config/mysql");

module.exports = {
  getCountSchedule: (searchDate, searchLocation, searchMovieId, sort) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT (*) AS total FROM schedule WHERE location LIKE '%${searchLocation}%' ${
          searchDate ? ` AND DAY(dateStart) =${searchDate}` : ""
        } AND movieId=${searchMovieId}`,
        (error, result) => {
          if (!error) {
            resolve(result[0].total);
          } else {
            console.log(error);
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getAllSchedule: (
    limit,
    offset,
    searchLocation,
    searchMovieId,
    sort,
    searchDate
  ) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT schedule.id,schedule.movieId,schedule.premiere,schedule.price,schedule.location,schedule.dateStart,schedule.dateEnd,schedule.time,schedule.createdAt,schedule.updatedAt,movie.name,movie.category,movie.cast,movie.releaseDate,movie.duration,movie.synopsis FROM schedule JOIN movie ON movie.id=schedule.movieId WHERE location LIKE '%${searchLocation}%' ${
          searchDate ? ` AND DAY(dateStart) =${searchDate}` : ""
        } AND movieId = ${searchMovieId} ORDER BY ${sort} LIMIT ? OFFSET ?`,
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
  getScheduleById: (movieId) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM schedule WHERE id=?",
        movieId,
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
            console.log(error);
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
  deleteSchedule: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query("DELETE FROM schedule WHERE id=?", id, (error) => {
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
