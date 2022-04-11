const jwt = require("jsonwebtoken");
const helperWrapper = require("../../helper/wrapper");
const authModel = require("./authModel");
const bcrypt = require("bcrypt");
const req = require("express/lib/request");
const { sendMail } = require("../../helper/mail");
const redis = require("../../config/redis");
const { v4: uuidv4 } = require("uuid");

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
        id: uuidv4(),
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
      const setSendEmail = {
        to: email,
        subject: "Email Verification !",
        name: firstName,
        template: "verificationEmail.html",
        buttonUrl:
          "https://web.postman.co/workspace/My-Workspace~b27bc0ce-8cbc-461c-873f-4cebc5e42732/request/20137788-c80cc5c5-8273-4ab9-878a-6a4140d4d52f",
      };
      // const sendEmail = setSendEmail.buttonUrl;
      // if (!setSendEmail.email) {
      //   return helperWrapper.response(
      //     response,
      //     400,
      //     "activate your account",
      //     null
      //   );
      // }
      await sendMail(setSendEmail);
      //activation code
      const result = await authModel.register(setData);
      const dataId = result.email;
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
      const { email } = request.body;
      const result = await authModel.getActivation(email);
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

      //role validation
      if (checkUser[0].role !== "ADMIN") {
        const token = jwt.sign({ ...payload }, "RAHASIA", { expiresIn: "1h" });
        const refreshToken = jwt.sign({ ...payload }, "RAHASIABARU", {
          expiresIn: "24h",
        });
        return helperWrapper.response(response, 200, "succes login to user", {
          id: payload.id,
          token,
          refreshToken,
        });
      }
      if (checkUser[0].role == "ADMIN") {
        const token = jwt.sign({ ...payload }, "SECRET", {
          expiresIn: "24h",
        });
        const refreshToken = jwt.sign({ ...payload }, "SECRETBARU ", {
          expiresIn: "24h",
        });
        return helperWrapper.response(response, 200, "succes login to admin", {
          id: payload.id,
          token,
          refreshToken,
        });
      }
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  refresh: async (request, response) => {
    try {
      console.log(request.body);
      const { refreshToken } = request.body;
      const checkToken = await redis.get(`refreshToken:${refreshToken}`);
      if (checkToken) {
        return helperWrapper.response(
          response,
          403,
          "Your refresh token cannot be use",
          null
        );
      }

      jwt.verify(refreshToken, "RAHASIABARU", async (error, result) => {
        delete result.iat;
        delete result.exp;
        const token = jwt.sign(result, "RAHASIA", { expiresIn: "1h" });
        const newRefreshToken = jwt.sign(result, "RAHASIABARU", {
          expiresIn: "24h",
        });
        await redis.setEx(
          `refreshToken:${refreshToken}`,
          3600 * 48,
          refreshToken
        );
        console.log(result);
        return helperWrapper.response(response, 200, "Success refresh token", {
          id: result.id,
          token,
          refreshToken: newRefreshToken,
        });
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  logout: async (request, response) => {
    try {
      let token = request.headers.authorization;
      const { refreshToken } = request.body;
      token = token.split(" ")[1];
      redis.setEx(`accessToken:${token}`, 3600 * 24, token);
      redis.setEx(`refreshToken:${refreshToken}`, 3600 * 24, token);
      return helperWrapper.response(response, 200, "Success logout", null);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
