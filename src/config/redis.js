const redis = require("redis");
const client = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
});

(async () => {
  client.connect();
  client.on("connect", () => {
    console.log("youre now connected to db redis...");
  });
})();
module.exports = client;
