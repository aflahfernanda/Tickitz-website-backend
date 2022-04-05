const helperWrapper = require("../../helper/wrapper");
const scheduleModel = require("./scheduleModel");
const redis = require("../../config/redis");

module.exports = {
  getAllSchedule: async (request, response) => {
    try {
      let { page, limit, searchLocation, searchMovieId, sort } = request.query;
      //page and limit search process
      page = Number(page);
      if (!page) {
        page = 1;
      }
      limit = Number(limit);
      if (!limit) {
        limit = 100;
      }
      const offset = page * limit - limit;
      const totalData = await scheduleModel.getCountSchedule();
      const totalPage = Math.ceil(totalData / limit);

      //search location validation
      if (searchMovieId.length < 1 && searchLocation.length === 0) {
        searchLocation = "";
      }
      //search movie id validation
      if (searchLocation.length === 0 && searchMovieId.length >= 1) {
        searchLocation = 0;
      }

      //sorting process
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
      const dataSearchFound = result.length;
      const pageinfo = {
        dataSearchFound,
        page,
        totalPage,
        limit,
        totalData,
      };

      //save data to redis
      redis.setEx(`getSchedule`, 3600, JSON.stringify(result));

      //result
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

      //save data to redis
      redis.setEx(`getScheduleId:${id}`, 3600, JSON.stringify(result));

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
