const express = require("express");

const Router = express.Router();

const movieController = require("./movie controller");

Router.get("/", movieController.getAllMovie);
Router.get("/:id", movieController.getMovieById);
Router.post("/", movieController.createMovie);
Router.patch("/:id", movieController.updateMovie);
Router.delete("/:id", movieController.deleteMovie);
// Router.get("/hello", movieController.getHello);
// Router.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("hello world");
// });

module.exports = Router;
