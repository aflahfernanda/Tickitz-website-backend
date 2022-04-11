const jwt = require("jsonwebtoken");
const helperWrapper = require("../helper/wrapper");
const redis = require("../config/redis");

module.exports = {
  userAuthentication: async (request, response, next) => {
    let token = request.headers.authorization;
    if (!token) {
      return helperWrapper.response(response, 403, "please login first", null);
    }
    token = token.split(" ")[1];

    const checkRedis = await redis.get(`accessToken:${token}`);
    if (checkRedis) {
      return helperWrapper.response(
        response,
        403,
        "Your token is destroyed please login again",
        null
      );
    }
    jwt.verify(token, "RAHASIA", (error, result) => {
      if (error) {
        return helperWrapper.response(
          response,
          403,
          "plis login to user",
          null
        );
      }
      request.decodeToken = result;
      // decodeToken= data user log in
      next();
    });
  },
  isAdminAuthentication: (request, response, next) => {
    let token = request.headers.authorization;
    if (!token) {
      return helperWrapper.response(response, 403, "please login first", null);
    }
    token = token.split(" ")[1];

    jwt.verify(token, "SECRET", (error, result) => {
      if (error) {
        return helperWrapper.response(
          response,
          403,
          "only admin can change the data",
          null
        );
      }
      request.decodeToken = result;
      // decodeToken= data user log in
      next();
    });
    // console.log(request.decodeToken);
    // tambahkan  proses untuk mengecek apakah yang login itu admin?
    // jika tidak berikan respon error
    // jika ya lanjutkan ke controller
  },
};
