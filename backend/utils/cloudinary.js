const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name : "dyowslbun",
    api_key : "822558121387534",
    api_secret : "ltWDrRTeuoQjoZsCFi1XFZErDo8",
});

module.exports = cloudinary;