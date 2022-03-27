const connection = require("../../config/mysql");

module.exports = {
  createBooking: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT into booking SET?",
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
  createBookingSeat: (seat) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT into bookingseat SET?",
        seat,
        (error, seatResult) => {
          if (!error) {
            const newResult = {
              id: seatResult.insertId,
              ...seat,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
      console.log(query.sql);
    }),
};
