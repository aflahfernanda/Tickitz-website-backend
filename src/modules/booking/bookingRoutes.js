const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");
const middlewareAuth = require("../../middleware/auth");
const { postMidtransNotification } = require("./bookingController");

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
Router.get(
  "/userId/:scheduleId",
  middlewareAuth.userAuthentication,
  bookingController.getBookingByIdBooking
);
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
Router.post(
  "/midtrans-notification",
  middlewareAuth.userAuthentication,
  bookingController.postMidtransNotification
);

module.exports = Router;
