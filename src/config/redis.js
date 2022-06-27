const redis = require("redis");
require("dotenv").config();

const client = redis.createClient({
  url: `redis://:nzOWPe5TRY84XmVvZKSIVoWQDE797JeI@redis-17305.c57.us-east-1-4.ec2.cloud.redislabs.com:17305`,
});

(async () => {
  client.connect();
  client.on("connect", () => {
    console.log("youre now connected to db redis...");
  });
})();
module.exports = client;
