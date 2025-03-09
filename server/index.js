const express = require('express');
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const authRoute = require('./Routes/authRoute');
const taskManagerRoute = require("./Routes/taskManagment");
const port = process.env.PORT;
const mongoDB_Url = process.env.MONGODB_URL;


app.use(express.json());
app.use(cors());


mongoose
  .connect(mongoDB_Url)
  .then(() => {
    console.log('server is connected to mmongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

app.get('/',(req,res)=>{
  res.json("hello world");
})

app.use('/api/auth',authRoute);
app.use('/api',taskManagerRoute);

