const express = require("express");

const Router = express.Router();

const movieRoutes = require("../modules/movie/movieRoutes");
const scheduleRoutes = require("../modules/schedule/scheduleRoutes");
const bookingRoutes = require("../modules/booking/bookingRoutes");
const authRoutes = require("../modules/auth/authRoutes");
const userRoutes = require("../modules/user/userRoutes");

Router.use("/movie", movieRoutes);
Router.use("/schedule", scheduleRoutes);
Router.use("/booking", bookingRoutes);
Router.use("/auth", authRoutes);
Router.use("/user", userRoutes);
// router.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("hello world");
// });

module.exports = Router;
