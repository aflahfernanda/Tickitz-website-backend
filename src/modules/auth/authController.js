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

      //must fill data
      if (!firstName || !lastName || !noTelp) {
        return helperWrapper.response(
          response,
          400,
          "fill data corectly",
          null
        );
      }
      if (!email) {
        return helperWrapper.response(response, 400, "fill email box", null);
      }
      if (!password) {
        return helperWrapper.response(response, 400, "fill password box", null);
      }

      //email must contain @gmail.com
      const emailValid = email.split("@", 1);
      const emailValid2 = email.split("@", 2);
      if (email !== `${emailValid[0]}@${emailValid2[1]}`) {
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
      const setSendEmail = {
        to: email,
        subject: "Email Verification !",
        name: firstName + lastName,
        template: "verificationEmail.html",
        authCode: result.id,
        buttonUrl: `localhost:3001/auth/activate/${setData.id}`,
      };
      await sendMail(setSendEmail);
      const dataId = result.email;
      return helperWrapper.response(
        response,
        200,
        "succes register user , activate account to Log In ",
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
      const checkResult = await authModel.getUserByUserId(id);
      if (checkResult.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const result = await authModel.getActivation(id);

      return helperWrapper.response(
        response,
        200,
        "succes verify account",
        result
      );
    } catch (error) {
      return helperWrapper.response(
        response,
        400,
        "failed verify account",
        null
      );
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
      let secretAccesToken = "";
      let secretRefreshToken = "";
      //role validation
      if (checkUser[0].role !== "ADMIN") {
        secretAccesToken = "RAHASIA";
        secretRefreshToken = "RAHASIABARU";
      }
      if (checkUser[0].role == "ADMIN") {
        secretAccesToken = "SECRET";
        secretRefreshToken = "SECRETBARU";
      }
      const token = jwt.sign({ ...payload }, secretAccesToken, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign({ ...payload }, secretRefreshToken, {
        expiresIn: "24h",
      });
      return helperWrapper.response(response, 200, "succes login", {
        id: payload.id,
        token,
        refreshToken,
      });
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  forgotPassword: async (request, response) => {
    try {
      // pasword hash
      const { email, linkDirect } = request.body;
      const dataEmail = await authModel.getEmail(email);
      if (dataEmail.length < 1) {
        return helperWrapper.response(
          response,
          404,
          "email not registed",
          null
        );
      }
      const otp = Math.floor(Math.random() * 899999 + 100000);

      const setSendEmail = {
        to: email,
        subject: "Forgot Password Verification!",
        template: "forgotPassword.html",
        otpKey: otp,
        linkENV: process.env.LINK_FRONTEND,
        buttonUrl: otp,
      };
      await sendMail(setSendEmail);
      // activation code
      const result = await authModel.setOTP(email, otp);
      return helperWrapper.response(
        response,
        200,
        `email valid check your email box for reset password `,
        email
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  resetPassword: async (request, response) => {
    try {
      const { keyChangePassword, newPassword, confirmPassword } = request.body;
      const checkResult = await authModel.getOTP(keyChangePassword);
      if (checkResult.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `your key is not valid`,
          null
        );
      }
      const id = checkResult[0].id;
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
      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }
      const result = await authModel.updatePassword(id, hash, setData);

      return helperWrapper.response(
        response,
        200,
        "succes reset Password",
        result
      );
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
