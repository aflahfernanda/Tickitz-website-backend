const express = require("express");

const Router = express.Router();

const movieController = require("./movieController");
const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/uploadMovie");
const middlewareRedis = require("../../middleware/redis");

Router.get("/", movieController.getAllMovie);
Router.get(
  "/:id",
  middlewareRedis.getMovieByIdRedis,
  movieController.getMovieById
);
Router.post(
  "/",
  middlewareAuth.isAdminAuthentication,
  middlewareUpload,
  movieController.createMovie
);
Router.patch(
  "/:id",
  middlewareAuth.isAdminAuthentication,
  middlewareUpload,
  middlewareRedis.clearMovieRedis,
  movieController.updateMovie
);
Router.delete(
  "/:id",
  middlewareAuth.isAdminAuthentication,
  middlewareUpload,
  movieController.deleteMovie
);

module.exports = Router;
