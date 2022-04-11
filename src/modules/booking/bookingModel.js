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
  createBookingSeat: (bookingId, seat) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        `INSERT into bookingseat(bookingId,seat) VALUES (${bookingId},'${seat}')`,
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
        `SELECT booking.scheduleId,booking.dateBooking,booking.timeBooking,bookingseat.seat FROM bookingseat JOIN booking ON bookingseat.bookingId=booking.scheduleId WHERE scheduleId = ${scheduleId} AND dateBooking ='${dateBooking}' AND timeBooking ='${timeBooking}'`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getDashboardBooking: (premiere, movieId, location) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT Id FROM booking JOIN schedule ON scheduleId.booking = schedule.id WHERE premiere='${premiere}' movieId=${movieId} location='${location}'`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getBookingByIdBooking: (scheduleId) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT booking.id,booking.scheduleId,booking.dateBooking,booking.timeBooking,booking.totalTicket,booking.totalPayment,booking.paymentMethod,booking.statusPayment,booking.statusUsed,booking.createdAt,booking.updateAt,schedule.movieId ,movie.name,movie.category FROM booking JOIN schedule ON booking.scheduleId=schedule.id JOIN movie ON schedule.movieId=movie.id WHERE scheduleId=${scheduleId}  `,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getBookingByIdBookingSeat: (scheduleId) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT bookingseat.seat FROM bookingseat JOIN booking ON bookingseat.bookingId=booking.scheduleId WHERE scheduleId=${scheduleId} `,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  updateStatusBooking: (scheduleId, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE booking SET statusUsed='not active' WHERE scheduleId=${scheduleId}`,
        (error) => {
          if (!error) {
            const newResult = {
              scheduleId,
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
        `SELECT user.firstName,user.lastName,user.email,booking.userId,booking.id,booking.id,booking.scheduleId,booking.dateBooking,booking.timeBooking,booking.totalTicket,booking.totalPayment,booking.paymentMethod,booking.statusPayment,booking.statusUsed,booking.createdAt,booking.updateAt,schedule.movieId ,movie.name,movie.category FROM user JOIN booking ON user.id = booking.userId JOIN schedule ON booking.scheduleId=schedule.id JOIN movie ON schedule.movieId=movie.id WHERE userId=${userId}  `,
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
        `INSERT into booking SET paymentMethod='${transaction_status}' ,statusPayment='${transaction_status}' ,updateAt='${transaction_time}' WHERE id='${order_id}'
        `,
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
