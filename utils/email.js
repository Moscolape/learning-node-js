const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "chunkums088@gmail.com",
    pass: "fwkfkesfvlhllrwd"
  },
});

module.exports = transporter;