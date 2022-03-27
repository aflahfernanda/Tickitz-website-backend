const helperWrapper = require("../../hepler/wrapper");
const bookingModel = require("./booking model");

module.exports = {
  createBooking: async (request, response) => {
    try {
      const {
        scheduleId,
        dateBooking,
        timeBooking,
        totalPayment,
        paymentMethod,
        statusPayment,
      } = request.body;
      const setData = {
        scheduleId,
        dateBooking,
        timeBooking,
        totalPayment,
        paymentMethod,
        statusPayment,
      };

      const { seat } = request.body;
      const result = await bookingModel.createBooking(setData);
      const seatResult = await bookingModel.createBookingSeat(seat);
      return helperWrapper.response(
        response,
        200,
        "succes create data",
        result,
        seatResult
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
