const redis = require("redis");
require("dotenv").config();

const client = redis.createClient({
  url: `redis://:RgJNvaPoFvqfoYL0cLoKCMeh9uuw7PZR@redis-18841.c98.us-east-1-4.ec2.cloud.redislabs.com:18841`,
});

(async () => {
  client.connect();
  client.on("connect", () => {
    console.log("youre now connected to db redis...");
  });
})();
module.exports = client;
