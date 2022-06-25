const express = require("express");

const Router = express.Router();
const userController = require("./userController");
const middlewareUploadImage = require("../../middleware/uploadImageUser");

Router.get("/:id", userController.getUserByUserId);
Router.patch("/profile/:id", userController.updateProfile);
Router.patch("/password/:id", userController.updatePassword);
Router.patch("/image/:id", middlewareUploadImage, userController.updateImage);
Router.delete("/delete/:id", middlewareUploadImage, userController.deleteImage);

module.exports = Router;
