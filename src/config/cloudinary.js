const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: "da776aoko",
  api_key: "998317556423261",
  api_secret: "W5PdJgRZs7qcMb_FEtDTraZQzpw",
});
module.exports = cloudinary;
