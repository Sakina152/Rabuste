const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "website-assets",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [
      { quality: "auto", fetch_format: "auto" },
    ],
  },
});

const upload = multer({ storage });

module.exports = upload;
