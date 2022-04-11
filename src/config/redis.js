const redis = require("redis");
require("dotenv").config();

const client = redis.createClient({
  redisHost: process.env.redisHost,
  redisPort: process.env.redisPort,
  redisPassword: process.env.redisPassword,
});

(async () => {
  client.connect();
  client.on("connect", () => {
    console.log("youre now connected to db redis...");
  });
})();
module.exports = client;
