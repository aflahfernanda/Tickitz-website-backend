const express = require("express");

const Router = express.Router();

const scheduleController = require("./scheduleController");
const middlewareRedis = require("../../middleware/redis");
const middlewareAuth = require("../../middleware/auth");

Router.get("/", scheduleController.getAllSchedule);
Router.get(
  "/:movieId",
  middlewareRedis.getScheduleByIdRedis,
  scheduleController.getScheduleById
);
Router.post(
  "/",
  middlewareAuth.isAdminAuthentication,
  middlewareRedis.clearScheduleRedis,
  scheduleController.createSchedule
);
Router.patch(
  "/:id",
  middlewareAuth.isAdminAuthentication,
  middlewareRedis.clearScheduleRedis,
  scheduleController.updateSchedule
);
Router.delete(
  "/:id",
  middlewareAuth.isAdminAuthentication,
  middlewareRedis.clearScheduleRedis,
  scheduleController.deleteSchedule
);
// Router.get("/hello", movieController.getHello);
// Router.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("hello world");
// });

module.exports = Router;
