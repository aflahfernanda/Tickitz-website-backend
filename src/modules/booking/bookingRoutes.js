const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");
const middlewareAuth = require("../../middleware/auth");
const { postMidtransNotification } = require("./bookingController");

Router.get("/", bookingController.getSeatBooking);
Router.get("/dashboard", bookingController.getDashboardBooking);
Router.post(
  "/",
  middlewareAuth.userAuthentication,
  bookingController.createBooking
);
Router.get("/:id", bookingController.getBookingByUserId);
Router.get("/bookingId/:id", bookingController.getBookingByIdBooking);

Router.patch("/:id", bookingController.updateStatusBooking);
Router.post(
  "/midtrans-notification",
  middlewareAuth.userAuthentication,
  bookingController.postMidtransNotification
);

module.exports = Router;
