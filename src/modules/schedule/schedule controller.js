const helperWrapper = require("../../hepler/wrapper");
const scheduleModel = require("./schedule model");

module.exports = {
  getAllSchedule: async (request, response) => {
    try {
      let { page, limit } = request.query;
      page = Number(page);
      if (page === 0) {
        page = 1;
      }
      limit = Number(limit);
      if (limit === 0) {
        limit = 100;
      }
      const offset = page * limit - limit;
      const totalData = await scheduleModel.getCountSchedule();
      const totalPage = Math.ceil(totalData / limit);

      let { searchLocation } = request.query;
      const { searchMovieId } = request.query;
      if (searchMovieId.length < 1 && searchLocation.length === 0) {
        searchLocation = "";
      }
      if (searchLocation.length === 0 && searchMovieId.length >= 1) {
        searchLocation = 0;
      }
      console.log(searchMovieId);
      let { sort } = request.query;
      if (sort === "movieId DESC") {
        sort = "movieId DESC";
      } else {
        sort = "movieId ASC";
      }

      const result = await scheduleModel.getAllSchedule(
        limit,
        offset,
        searchLocation,
        searchMovieId,
        sort
      );
      const datafound = result.length;
      const pageinfo = {
        datafound,
        page,
        totalPage,
        limit,
        totalData,
      };

      //   response.status(200);
      //   response.send("hello world");
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
  getScheduleById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await scheduleModel.getScheduleById(id);
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
      return helperWrapper.response(response, 200, "succes get data", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  createSchedule: async (request, response) => {
    try {
      const { movieId, premiere, price, location, dateStart, dateEnd, time } =
        request.body;
      const setData = {
        movieId,
        premiere,
        price,
        location,
        dateStart,
        dateEnd,
        time,
      };
      const result = await scheduleModel.createSchedule(setData);

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
  updateSchedule: async (request, response) => {
    try {
      const { id } = request.params;
      const checkResult = await scheduleModel.getScheduleById(id);
      if (checkResult.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      const { movieId, premiere, price, location, dateStart, dateEnd, time } =
        request.body;
      const setData = {
        movieId,
        premiere,
        price,
        location,
        dateStart,
        dateEnd,
        time,
        updatedAt: new Date(Date.now()),
      };
      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await scheduleModel.updateSchedule(id, setData);

      return helperWrapper.response(response, 200, "succes get data", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  deleteSchedule: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await scheduleModel.deleteSchedule(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
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
