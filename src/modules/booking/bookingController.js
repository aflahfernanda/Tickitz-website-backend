const helperWrapper = require("../../helper/wrapper");
const bookingModel = require("./bookingModel");

module.exports = {
  createBooking: async (request, response) => {
    try {
      const {
        userId,
        scheduleId,
        dateBooking,
        timeBooking,
        totalPayment,
        paymentMethod,
        statusPayment,
      } = request.body;

      const { seat } = request.body;
      let bookingId = request.body;
      bookingId = scheduleId;
      seat.forEach((element) => {
        bookingModel.createBookingSeat(bookingId, element);
      });

      let totalTicket = request.body;
      totalTicket = seat.length;
      const setData = [
        {
          userId,
          scheduleId,
          dateBooking,
          timeBooking,
          totalTicket,
          totalPayment,
          paymentMethod,
          statusPayment,
        },
        { bookingId, seat },
      ];
      const result = await bookingModel.createBooking(setData);
      return helperWrapper.response(
        response,
        200,
        "succes create data",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getSeatBooking: async (request, response) => {
    try {
      const { scheduleId, dateBooking, timeBooking } = request.query;
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
      const { id } = request.params;
      await bookingModel.getDashboardBooking(id);
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
      const { scheduleId } = request.params;
      const result = await bookingModel.getBookingByIdBooking(scheduleId);
      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${scheduleId} not found`,
          null
        );
      }
      const seatResult = await bookingModel.getBookingByIdBookingSeat(
        scheduleId
      );
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
      const { scheduleId } = request.params;
      const checkResult = await bookingModel.getBookingByIdBooking(scheduleId);
      if (checkResult.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${scheduleId} not found`,
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

      const result = await bookingModel.updateStatusBooking(
        scheduleId,
        setData
      );

      //   response.status(200);
      //   response.send("hello world");
      return helperWrapper.response(response, 200, "succes get data", result);
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getBookingByUserId: async (request, response) => {
    try {
      const { userId } = request.params;
      const result = await bookingModel.getBookingByUserId(userId);
      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by userId ${userId} not found`,
          null
        );
      }
      const seatResult = await bookingModel.getBookingByIdBookingSeat(userId);
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
};
