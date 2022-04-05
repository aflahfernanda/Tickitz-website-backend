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
Router.patch(
  "/firstName/:id",
  middlewareAuth.isAdminAuthentication,
  userController.updatePassword
);
Router.patch(
  "/firstName/user/:id",
  middlewareAuth.userAuthentication,
  userController.updatePassword
);
Router.patch(
  "/image/user/:id",
  middlewareAuth.userAuthentication,
  middlewareUploadImage,
  userController.updateImage
);
Router.patch(
  "/image/:id",
  middlewareAuth.isAdminAuthentication,
  middlewareUploadImage,
  userController.updateImage
);
Router.delete(
  "/:id",
  middlewareAuth.isAdminAuthentication,
  middlewareUploadImage,
  userController.closeAccount
);
Router.delete(
  "/user/:id",
  middlewareAuth.userAuthentication,
  middlewareUploadImage,
  userController.closeAccount
);

module.exports = Router;
