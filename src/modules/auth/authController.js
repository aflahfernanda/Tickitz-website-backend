const jwt = require("jsonwebtoken");
const helperWrapper = require("../../helper/wrapper");
const authModel = require("./authModel");
const bcrypt = require("bcrypt");
const req = require("express/lib/request");

module.exports = {
  register: async (request, response) => {
    try {
      //pasword hash
      let { password } = request.body;
      if (!password) {
        return helperWrapper.response(response, 400, "fill password box", null);
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const { firstName, lastName, noTelp, email } = request.body;
      const setData = {
        firstName,
        lastName,
        noTelp,
        email,
        password: hash,
      };

      //must fill email
      if (!email) {
        return helperWrapper.response(response, 400, "fill email box", null);
      }

      //email must contain @gmail.com
      const emailValid = email.split("@", 1);
      const emailValid2 = "gmail.com";
      if (email !== emailValid[0] + "@" + emailValid2) {
        return helperWrapper.response(
          response,
          400,
          "email is not valid",
          null
        );
      }
      const dataEmail = await authModel.getEmail(email);
      if (dataEmail.length > 0) {
        return helperWrapper.response(
          response,
          400,
          "email already registered",
          null
        );
      }
      //activation code
      const result = await authModel.register(setData);
      const dataId = result.id;
      return helperWrapper.response(
        response,
        200,
        `succes register user , activate account to Log In your activate code is localhost:3001/auth/activate/` +
          dataId,
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  activateEmail: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await authModel.getActivation(id);
      console.log(result);
      return helperWrapper.response(
        response,
        200,
        "your email is active",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  login: async (request, response) => {
    try {
      const { email } = request.body;
      const checkUser = await authModel.getUserByEmail(email);

      // email not found check
      if (checkUser.length < 1) {
        return helperWrapper.response(
          response,
          404,
          "email not registed",
          null
        );
      }
      if (checkUser[0].status == "not active") {
        return helperWrapper.response(
          response,
          404,
          "activate your account first",
          null
        );
      }
      // // validasi ROLE
      if (checkUser[0].role !== "ADMIN") {
        let { password } = request.body;
        const checkPassword = await authModel.getUserByPassword(email);
        const stringPass = checkPassword[0].password;
        const validPass = await bcrypt.compare(password, stringPass);

        //if wrong password
        if (!validPass) {
          return helperWrapper.response(response, 400, "wrong password", null);
        }
        // prosess jwt

        const payload = checkUser[0];
        delete payload.password;
        const token = jwt.sign({ ...payload }, "RAHASIA", { expiresIn: "24h" });
        return helperWrapper.response(response, 200, "succes login to user", {
          id: payload.id,
          token,
        });
      }
      if (checkUser[0].role == "ADMIN") {
        let { password } = request.body;
        const checkPassword = await authModel.getUserByPassword(email);
        const stringPass = checkPassword[0].password;
        const validPass = await bcrypt.compare(password, stringPass);

        //if wrong password
        if (!validPass) {
          return helperWrapper.response(response, 400, "wrong password", null);
        }

        // prosess jwt

        const payload = checkUser[0];
        delete payload.password;
        const token = jwt.sign({ ...payload }, "SECRET", {
          expiresIn: "24h",
        });
        return helperWrapper.response(response, 200, "succes login to admin", {
          id: payload.id,
          token,
        });
      }
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
