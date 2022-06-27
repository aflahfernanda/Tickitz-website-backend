const helperWrapper = require("../../helper/wrapper");
const bookingModel = require("./bookingModel");
const { v4: uuidv4 } = require("uuid");
const helperMidtrans = require("../../helper/midtrans");

module.exports = {
  createBooking: async (request, response) => {
    try {
      let {
        userId,
        scheduleId,
        dateBooking,
        timeBooking,
        totalPayment,
        paymentMethod,
        statusPayment,
        seat,
        bookingId,
      } = request.body;

      const price = await bookingModel.getScheduleById(scheduleId);
      const dataPrice = price[0].price;
      let totalTicket = request.body;
      totalTicket = seat.length;
      totalPayment = totalTicket * dataPrice;

      // return helperWrapper.response(response, 200, "Success post data !", {
      //   id: 1,
      //   ...request.body,
      //   redirectUrl: resultMidtrans.redirect_url,
      // });
      const setData = [
        {
          id: uuidv4(),
          userId,
          scheduleId,
          dateBooking,
          timeBooking,
          totalTicket,
          totalPayment,
          paymentMethod,
          statusPayment,
        },
      ];
      const setDataMidtrans = {
        id: setData[0].id,
        total: setData[0].totalPayment,
      };
      const resultMidtrans = await helperMidtrans.post(setDataMidtrans);
      console.log(resultMidtrans);
      const result = await bookingModel.createBooking(setData);
      bookingId = result.id;
      seat.forEach((element) => {
        bookingModel.createBookingSeat(setData[0].id, element);
      });
      return helperWrapper.response(
        response,
        200,
        "succes create data",
        result,
        resultMidtrans.redirect_url
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  postMidtransNotification: async (request, response) => {
    try {
      // console.log(request.body);
      // const result = await helperMidtrans.notif(request.body);
      // const orderId = result.order_id;
      // const transactionStatus = result.transaction_status;
      // const fraudStatus = result.fraud_status;
      // const updated = result.transaction_time;
      const result = await helperMidtrans.notif(request.body);
      const fraudStatus = result.fraud_status;
      const transactionStatus = result.transaction_status;
      let { transaction_status, transaction_time, order_id } = request.body;

      // Sample transactionStatus handling logic

      if (transactionStatus == "capture") {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus == "challenge") {
          const setData = {
            transaction_status,
            transaction_time,
            order_id,
          };
          const result = await bookingModel.midtrans(setData);
          return helperWrapper.response(
            response,
            200,
            "succes create data",
            result
          );
        } else if (fraudStatus == "accept") {
          const setData = {
            transaction_status,
            transaction_time,
            order_id,
          };
          const result = await bookingModel.midtrans(setData);
          return helperWrapper.response(
            response,
            200,
            "succes create data",
            result
          );
        }
      } else if (transactionStatus == "settlement") {
        const setData = {
          transaction_status,
          transaction_time,
          order_id,
        };
        const result = await bookingModel.midtrans(setData);
        return helperWrapper.response(
          response,
          200,
          "succes create data",
          result
        );
      } else if (transactionStatus == "deny") {
        // TODO you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
        // UBAH STATUS PEMBAYARAN MENJADI FAILED
      } else if (
        transactionStatus == "cancel" ||
        transactionStatus == "expire"
      ) {
        // TODO set transaction status on your databaase to 'failure'
        // UBAH STATUS PEMBAYARAN MENJADI FAILED
      } else if (transactionStatus == "pending") {
        // TODO set transaction status on your databaase to 'pending' / waiting payment
        // UBAH STATUS PEMBAYARAN MENJADI PENDING
      }
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getSeatBooking: async (request, response) => {
    try {
      const { scheduleId, dateBooking, timeBooking } = request.query;
      if (!timeBooking) {
        timeBooking = "0";
      }
      const result = await bookingModel.getSeatBooking(
        scheduleId,
        dateBooking,
        timeBooking
      );

      return helperWrapper.response(response, 200, "succes get data", result);
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getDashboardBooking: async (request, response) => {
    try {
      // const { id } = request.params;
      // await bookingModel.getDashboardBooking(id);
      const { premiere, movieId, location } = request.query;
      const result = await bookingModel.getDashboardBooking(
        premiere,
        movieId,
        location
      );
      return helperWrapper.response(response, 200, "succes get data", result);
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getBookingByIdBooking: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await bookingModel.getBookingByIdBooking(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      const seatResult = await bookingModel.getBookingByIdBookingSeat(id);
      const newResult = { ...result, seatResult };
      return helperWrapper.response(
        response,
        200,
        "succes get data",
        newResult
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  updateStatusBooking: async (request, response) => {
    try {
      const { id } = request.params;
      const checkResult = await bookingModel.getBookingByIdBooking(id);
      if (checkResult.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      const { statusUsed } = request.params;
      const setData = {
        statusUsed,
        updateAt: new Date(Date.now()),
      };
      console.log(statusUsed);
      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await bookingModel.updateStatusBooking(id, setData);

      //   response.status(200);
      //   response.send("hello world");
      return helperWrapper.response(
        response,
        200,
        "succes update data",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getBookingByUserId: async (request, response) => {
    try {
      const { userId } = request.params;
      const result = await bookingModel.getBookingByUserId(userId);
      console.log(result);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by userId ${userId} not found`,
          null
        );
      }
      return helperWrapper.response(response, 200, "succes get data", result);
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
