const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.SECRET_KEY;

function authentication(req, res, next){
  let token = req.header("Authorization").split(" ")[1];
  if(!token){
    res.status(200).json({success:false, msg:"your are not authorized"});
  }
  else{
    jwt.verify(token,secretKey,(err,data)=>{
      if(err){
        res.status(401).json({ error: true, msg: "Invalid token." });
      }
      else{
        req.user = data;
        next();
      }
    })
  }
}

module.exports = authentication;