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
  getBookingById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM booking WHERE id=?",
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
  createTotalTicket: (totalTicket) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        `INSERT into booking (totalTicket) value(${totalTicket})`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
      console.log(query.sql);
    }),
  createBookingSeat: (id, seat) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        `INSERT into bookingseat(bookingId,seat) VALUES ('${id}','${seat}')`,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
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
  getSeatBooking: (scheduleId, dateBooking, timeBooking) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT booking.scheduleId,booking.dateBooking,booking.timeBooking,bookingseat.seat FROM bookingseat JOIN booking ON bookingseat.bookingId=booking.id WHERE timeBooking LIKE '%${timeBooking}%' ${
          scheduleId ? `AND scheduleId = ${scheduleId}` : ""
        } ${dateBooking ? `AND dateBooking ='${dateBooking}'` : ""} `,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            console.log(error);
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getDashboardBooking: (premiere, movieId, location) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT booking.id,booking.scheduleId,booking.userId,booking.userId,booking.dateBooking,booking.totalTicket,booking.timeBooking,booking.totalPayment,schedule.id,schedule.movieId,schedule.price,schedule.premiere,schedule.location FROM booking JOIN schedule ON booking.scheduleId = schedule.id WHERE schedule.location LIKE '%${location}%'${
          premiere ? `AND schedule.premiere='${premiere}' ` : ""
        } ${movieId ? `AND schedule.movieId=${movieId} ` : ""}`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            console.log(error);
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getBookingByIdBooking: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT booking.id,booking.scheduleId,booking.dateBooking,booking.timeBooking,booking.totalTicket,booking.totalPayment,booking.paymentMethod,booking.statusPayment,booking.statusUsed,booking.createdAt,booking.updateAt,schedule.movieId ,movie.name,movie.category FROM booking JOIN schedule ON booking.scheduleId=schedule.id JOIN movie ON schedule.movieId=movie.id WHERE booking.id='${id}'  `,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getBookingByIdBookingSeat: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT bookingseat.seat,booking.id FROM bookingseat JOIN booking ON bookingseat.bookingId=booking.id WHERE booking.id='${id}' `,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  updateStatusBooking: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE booking SET statusUsed='not active' WHERE id='${id}'`,
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
  getBookingByUserId: (userId) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT booking.id,booking.userId,booking.scheduleId,booking.dateBooking,booking.timeBooking,booking.totalTicket,booking.totalPayment,booking.paymentMethod,booking.statusPayment,booking.statusUsed,booking.createdAt,booking.updateAt,schedule.premiere,schedule.price,schedule.movieId,schedule.location,movie.name,movie.category FROM booking JOIN schedule ON booking.scheduleId=schedule.id JOIN movie ON schedule.movieId=movie.id WHERE booking.userId='${userId}'  `,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  midtrans: (transaction_status, order_id, transaction_time) =>
    new Promise((resolve, reject) => {
      connection.query(
        `INSERT into booking SET paymentMethod='${transaction_status}' ,statusPayment='${transaction_status}' WHERE id='${order_id}'`,
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
