const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");
const middlewareAuth = require("../../middleware/auth");

Router.get(
  "/",
  middlewareAuth.userAuthentication,
  bookingController.getSeatBooking
);
Router.post(
  "/",
  middlewareAuth.userAuthentication,
  bookingController.createBooking
);
Router.get(
  "/:userId",
  middlewareAuth.isAdminAuthentication,
  bookingController.getBookingByUserId
);
Router.get("/userId/:scheduleId", bookingController.getBookingByIdBooking);
Router.get(
  "/schedule",
  middlewareAuth.isAdminAuthentication,
  bookingController.getDashboardBooking
);
Router.patch(
  "/:scheduleId",
  middlewareAuth.isAdminAuthentication,
  bookingController.updateStatusBooking
);

module.exports = Router;
