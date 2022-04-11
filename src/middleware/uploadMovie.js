const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const helperWrapper = require("../helper/wrapper");
const movieController = require("../modules/movie/movieController");

// JIKA MENYIMPAN DATA DI CLOUDINARY
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Tickitz/movie",
  },
});

const upload = multer({ storage }).single("image");

const handlingUpload = (request, response, next) => {
  upload(request, response, (error) => {
    if (error instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return helperWrapper.response(response, 401, error.message, null);
    } else if (error) {
      // An unknown error occurred when uploading.
      return helperWrapper.response(response, 401, error.message, null);
    }
    return next();
  });
};

module.exports = handlingUpload;

// const storage2 = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "Tickitz/user",
//   },
// });
// UNTUK PENGECEKAN LIMIT DAT EKSTENSI BISA DITAMBAHKAN DI MIDDLEWARE

// JIKA MENYIMPAN DATA DI DALAM PROJECT BACKEND
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "public/uploads/movie");
//   },
// filename(req, file, cb) {
//   console.log(file);
//   file = {
//     fieldname: 'image',
//     originalname: 'LogoFazztrack.png',
//     encoding: '7bit',
//     mimetype: 'image/png'
//   }
//     cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
//   },
// });
