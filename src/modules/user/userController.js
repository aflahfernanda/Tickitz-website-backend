const helperWrapper = require("../../helper/wrapper");
const userModel = require("./userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../../config/cloudinary");
const { image } = require("../../config/cloudinary");

module.exports = {
  getUserByUserId: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await userModel.getUserByUserId(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      return helperWrapper.response(response, 200, "succes get data", result);
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  updateProfile: async (request, response) => {
    try {
      const { id } = request.params;
      const checkResult = await userModel.getUserByUserId(id);
      if (checkResult.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const { firstName, lastName, noTelp } = request.body;
      const setData = {
        firstName,
        lastName,
        noTelp,
        updatedAt: new Date(Date.now()),
      };
      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await userModel.updateProfile(id, setData);

      //   response.status(200);
      //   response.send("hello world");
      return helperWrapper.response(
        response,
        200,
        "succes update profile",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  updateImage: async (request, response) => {
    try {
      const { id } = request.params;
      const checkResult = await userModel.getUserByUserId(id);
      if (checkResult.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const deleteImage = checkResult[0].image;

      const setData = {
        image: request.file
          ? `${request.file.filename}.${request.file.mimetype.split("/")[1]}`
          : "",
        updatedAt: new Date(Date.now()),
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }
      // delete image from cloudinary condition
      if (checkResult[0].image !== null) {
        const deleteImage = checkResult[0].image.split(".")[0];
        cloudinary.uploader.destroy(deleteImage, function (result) {
          return result;
        });
      }
      const result = await userModel.updateImage(id, setData);

      return helperWrapper.response(
        response,
        200,
        "succes update image",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  updatePassword: async (request, response) => {
    try {
      const { id } = request.params;
      const checkResult = await userModel.getUserByUserId(id);
      if (checkResult.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const { newPassword, confirmPassword } = request.body;

      // eslint-disable-next-line no-restricted-syntax

      if (newPassword !== confirmPassword) {
        return helperWrapper.response(
          response,
          400,
          "password Not Match",
          null
        );
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(confirmPassword, salt);
      const setData = {
        confirmPassword: hash,
        updatedAt: new Date(Date.now()),
      };
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }
      const result = await userModel.updatePassword(id, hash, setData);

      //   response.status(200);
      //   response.send("hello world");
      return helperWrapper.response(
        response,
        200,
        "succes update password",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  deleteImage: async (request, response) => {
    try {
      //untuk menghapus bisa menggunakan cloudinary.upload.destroy
      const { id } = request.params;
      const resultId = await userModel.getUserByUserId(id);
      const result = await userModel.deleteImage(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      //delete image from cloudinary
      if (resultId[0].image !== null) {
        const deleteImage = resultId[0].image.split(".")[0];
        cloudinary.uploader.destroy(deleteImage, function (result) {
          return result;
        });
      }
      return helperWrapper.response(
        response,
        200,
        "succes delete image",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
