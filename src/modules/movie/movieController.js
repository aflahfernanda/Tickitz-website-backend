const helperWrapper = require("../../helper/wrapper");
const movieModel = require("./movieModel");
const cloudinary = require("../../config/cloudinary");
const redis = require("../../config/redis");

module.exports = {
  getAllMovie: async (request, response) => {
    try {
      let { page, limit, searchName, searchRelease, sort } = request.query;
      //limit and page search process
      page = Number(page);
      if (!page) {
        page = 1;
      }
      limit = Number(limit);
      if (!limit) {
        limit = 100;
      }
      const offset = page * limit - limit;
      const totalData = await movieModel.getCountMovie(
        searchName,
        sort,
        searchRelease
      );
      const totalPage = Math.ceil(totalData / limit);

      //search name release validation
      if (!searchName) {
        searchName = "";
      }

      //sorting process and validation
      if (!sort) {
        sort = "name ASC";
      }
      const result = await movieModel.getAllMovie(
        limit,
        offset,
        searchName,
        sort,
        searchRelease
      );
      const dataSearchFound = result.length;
      const pageinfo = {
        dataSearchFound,
        page,
        totalPage,
        limit,
        totalData,
      };
      return helperWrapper.response(
        response,
        200,
        "succes get data",
        result,
        pageinfo
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getMovieById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await movieModel.getMovieById(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      //save data to redis
      redis.setEx(`getMovie:${id}`, 3600, JSON.stringify(result));
      return helperWrapper.response(response, 200, "succes get data", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  createMovie: async (request, response) => {
    try {
      const {
        name,
        category,
        synopsis,
        releaseDate,
        cast,
        director,
        duration,
      } = request.body;
      const setData = {
        name,
        category,
        synopsis,
        releaseDate,
        cast,
        director,
        duration,
        image: request.file
          ? `${request.file.filename}.${request.file.mimetype.split("/")[1]}`
          : "",
      };
      console.log(setData);
      const result = await movieModel.createMovie(setData);
      return helperWrapper.response(
        response,
        200,
        "succes create data",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  updateMovie: async (request, response) => {
    try {
      const { id } = request.params;
      const checkResult = await movieModel.getMovieById(id);
      if (checkResult.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const {
        name,
        category,
        synopsis,
        releaseDate,
        cast,
        director,
        duration,
      } = request.body;
      const setData = {
        name,
        category,
        synopsis,
        releaseDate,
        cast,
        director,
        duration,
        image: request.file
          ? `${request.file.filename}.${request.file.mimetype.split("/")[1]}`
          : "",
        updatedAt: new Date(Date.now()),
      };

      //delete image from cloudinary
      if (setData.image !== "") {
        cloudinary.uploader.destroy(function (result) {
          return result;
        });
      }
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

      const result = await movieModel.updateMovie(id, setData);

      //   response.status(200);
      //   response.send("hello world");
      return helperWrapper.response(
        response,
        200,
        "succes update data movie",
        result
      );
    } catch (error) {
      console.log(error.response);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  deleteMovie: async (request, response) => {
    try {
      //untuk menghapus bisa menggunakan cloudinary.upload.destroy
      const { id } = request.params;
      const resultId = await movieModel.getMovieById(id);
      const result = await movieModel.deleteMovie(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      const deleteImage = resultId[0].image.split(".")[0];

      //delete image from cloudinary
      cloudinary.uploader.destroy(function (result) {
        return result;
      });
      return helperWrapper.response(
        response,
        200,
        "succes delete data",
        resultId,
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
