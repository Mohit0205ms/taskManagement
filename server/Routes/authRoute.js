const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt');
const userSchema = require("../model/user");
const otpSchema = require('../model/otp');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const authentication = require('../controller/Authentication');
const sendMail = require('../controller/sendMail');
const secretKey = process.env.SECRET_KEY;

Router.post('/signup', async(req,res)=>{
  try{
    console.log(req.body);
    const password = req.body.password;
    const email = req.body.email;
    const isEmailExist = await userSchema.findOne({email: email})
    isEmailExist && res.status(409).json({error: true,msg: "Email already exists. Please use a different email."});
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt);
    const user = new userSchema({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword
    });
    const savedUserCredential = await user.save();
    res.status(201).json(savedUserCredential); // 201 is for source creation
  }catch(err){
    res.status(500).json({ error: true, msg: "Internal Server Error" });
  }
})

Router.post('/login', async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: true, msg: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log("Invalid password attempt");
      return res.status(401).json({ error: true, msg: "Invalid password" });
    }

    jwt.sign({ userId: user._id }, secretKey, (err, token) => {
      if (err) {
        console.error("JWT signing error:", err);
        return res.status(500).json({ error: true, msg: "Error in JWT" });
      }
      const data = { access_token: token, name: user.name, email: user.email };
      res.status(200).json(data);
    });

  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: true, msg: "Internal server error" });
  }
});

Router.post('/generate/otp',async(req,res)=>{
  try{
    const { email } = req.body;
    const otp = await sendMail(email);
    const Otp = new otpSchema({
      email: email,
      otp: otp
    })
    await Otp.save();
    res.status(200).json({ msg: 'Otp is shared on email', otp: otp });
  }catch(err){
    res.status(500).json({ error: true, msg: 'Internal Server Error' });
  }
})

Router.post('/verify/otp', async(req,res)=>{
  try{
    const { email, otp } = req.body;
    const user = await userSchema.findOne({email});
    if(!user){
      await otpSchema.deleteOne({email, otp});
      return res.status(404).json({error: true, msg: 'user does not exist please first create account'});
    }
    const otpPresent = await otpSchema.findOne({email, otp});
    if(!otpPresent){
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }
    await otpSchema.deleteOne({email, otp});
    res.status(200).json({ msg: 'OTP verified successfully' });
  }catch(err){
    res.status(500).json({ error: true, msg: 'Internal Server Error' });
  }
})

Router.post('/reset/password', async(req,res)=>{
  try{
    const { email, password } = req.body;
    console.log(email,password);
    const user = await userSchema.findOne({email});
    if(!user){
      return res.status(404).json({error: false, msg: 'user not found'});
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt);
    await user.updateOne({ password: hashPassword });
    res.status(200).json({ msg: 'password is changed successfully' });
  }catch(err){
    res.status(500).json({ error: true, msg: 'Internal Server Error' });
  }
})

module.exports = Router;
