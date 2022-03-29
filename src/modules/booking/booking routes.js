const express = require("express");

const Router = express.Router();

const bookingController = require("./booking controller");

Router.get("/", bookingController.getSeatBooking);
Router.post("/", bookingController.createBooking);
Router.get("/", bookingController.getDashboardBooking);
Router.get("/:scheduleId", bookingController.getBookingByIdBooking);
Router.patch("/:scheduleId", bookingController.updateStatusBooking);

module.exports = Router;
