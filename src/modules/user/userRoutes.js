const express = require("express");

const Router = express.Router();
const userController = require("./userController");
const middlewareUploadImage = require("../../middleware/uploadImageUser");
const middlewareAuth = require("../../middleware/auth");

Router.get(
  "/:id",
  middlewareAuth.isAdminAuthentication,
  userController.getUserByUserId
);
Router.patch(
  "/account/:id",
  middlewareAuth.isAdminAuthentication,
  userController.updateProfile
);
Router.patch(
  "/account/user/:id",
  middlewareAuth.userAuthentication,
  userController.updateProfile
);
Router.patch("/firstName/:id", userController.updatePassword);
Router.patch("/image/:id", middlewareUploadImage, userController.updateImage);
Router.delete("/:id", middlewareUploadImage, userController.closeAccount);

module.exports = Router;
