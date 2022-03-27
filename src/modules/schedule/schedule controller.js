const helperWrapper = require("../../hepler/wrapper");
const scheduleModel = require("./schedule model");

module.exports = {
  getAllSchedule: async (request, response) => {
    try {
      let { page, limit } = request.query;
      page = Number(page);
      limit = Number(limit);
      const offset = page * limit - limit;
      const totalData = await scheduleModel.getCountSchedule();
      const totalPage = Math.ceil(totalData / limit);

      let { searchLocation } = request.query;
      if (searchLocation.length <= 1) {
        searchLocation = 0;
      }
      let { searchMovieId } = request.query;
      if (searchMovieId < 1) {
        searchMovieId = null;
      }
      const { movieId } = request.query;

      const result = await scheduleModel.getAllSchedule(
        limit,
        offset,
        searchLocation,
        searchMovieId,
        movieId
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
        // console.log(data); // property
        // console.log(setData[data]); // value
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await scheduleModel.updateSchedule(id, setData);

      //   response.status(200);
      //   response.send("hello world");
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
      //   response.status(200);
      //   response.send("hello world");
      return helperWrapper.response(response, 200, "succes get data", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
