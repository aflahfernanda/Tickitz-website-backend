const redis = require("redis");
require("dotenv").config();

const client = redis.createClient({
  redisHost: "redis-18841.c98.us-east-1-4.ec2.cloud.redislabs.com",
  redisPort: "18841",
  redisPassword: "RgJNvaPoFvqfoYL0cLoKCMeh9uuw7PZR",
});

(async () => {
  client.connect();
  client.on("connect", () => {
    console.log("youre now connected to db redis...");
  });
})();
module.exports = client;
