require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const util = require('util');

const user = process.env.AUTH_USER;
const pass = process.env.AUTH_PASS;
const FROM = process.env.FROM;

const readFile = util.promisify(fs.readFile);

const sendMail = async (email) => {
  try {
    const receiverEmaile = email;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const templatePath = path.join(
      __dirname,
      '../templates/email',
      'otpTemplate.html',
    );
    const otpTemplate = readFile(templatePath, 'utf-8');
    const template = (await otpTemplate).replace('{{OTP}}', otp);
    let testAccount = await nodemailer.createTestAccount();
    const transporter = await nodemailer.createTransport({
      service: "gmail",
      secure: true,
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
          user: user,
          pass: pass
      }
    });
    transporter.sendMail(
      {
        from: FROM,
        to: receiverEmaile,
        subject: 'our OTP Code',
        html: template,
      },
      (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      },
    );
    console.log(otp,"otp");
    return otp;
  } catch (err) {}
};

module.exports = sendMail;