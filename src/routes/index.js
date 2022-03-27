const express = require("express");

const Router = express.Router();

const movieRoutes = require("../modules/movie/movie routes");
const scheduleRoutes = require("../modules/schedule/schedule routes");
const bookingRoutes = require("../modules/booking/booking routes");

Router.use("/movie", movieRoutes);
Router.use("/schedule", scheduleRoutes);
Router.use("/booking", bookingRoutes);

// router.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("hello world");
// });

module.exports = Router;
