const helperWrapper = require("../../hepler/wrapper");
const movieModel = require("./movie model");

module.exports = {
  getAllMovie: async (request, response) => {
    try {
      let { page, limit } = request.query;
      page = Number(page);
      limit = Number(limit);
      const offset = page * limit - limit;
      const totalData = await movieModel.getCountMovie();
      const totalPage = Math.ceil(totalData / limit);
      if (page.length === undefined) {
        page = 1;
      }

      let { searchName } = request.query;
      if (searchName.length === undefined) {
        searchName = null;
      }
      const { name } = request.query;
      const result = await movieModel.getAllMovie(
        limit,
        offset,
        searchName,
        name
      );
      const datafound = result.length;
      const pageinfo = {
        datafound,
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
      };
      const result = await movieModel.createMovie(setData);
      return helperWrapper.response(
        response,
        200,
        "succes create data",
        result
      );
    } catch (error) {
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
        updatedAt: new Date(Date.now()),
      };
      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await movieModel.updateMovie(id, setData);

      //   response.status(200);
      //   response.send("hello world");
      return helperWrapper.response(response, 200, "succes get data", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  deleteMovie: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await movieModel.deleteMovie(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      //   response.status(200);
      //   response.send("hello world");
      return helperWrapper.response(
        response,
        200,
        "succes delete data",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
