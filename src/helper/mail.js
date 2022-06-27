const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const fs = require("fs");
const mustache = require("mustache");
require("dotenv").config();

const clientId = process.env.MAIL_CLIENT_ID;
const clientSecret = process.env.MAIL_CLIENT_ID;
const refreshToken = process.env.MAIL_REFRESH_TOKEN;

const { OAuth2 } = google.auth;
const OAuth2Client = new OAuth2(clientId, clientSecret);
OAuth2Client.setCredentials({
  refresh_token: refreshToken,
});

module.exports = {
  sendMail: (data) =>
    new Promise((resolve, reject) => {
      const accessToken = OAuth2Client.getAccessToken;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "fernandaaflah@gmail.com",
          clientId,
          clientSecret,
          refreshToken,
          accessToken,
        },
      });

      const fileTemplate = fs.readFileSync(
        `src/template/email/${data.template}`,
        "utf8"
      );
      //   console.log(fileTemplate);

      const mailOptions = {
        from: '"Paytickz " <fernandaaflah@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        html: mustache.render(fileTemplate, { ...data }),
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    }),
};
