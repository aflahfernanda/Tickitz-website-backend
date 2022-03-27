const express = require("express");

const Router = express.Router();

const bookingController = require("./booking controller");

Router.post("/", bookingController.createBooking);
// Router.get("/hello", movieController.getHello);
// Router.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("hello world");
// });

module.exports = Router;
