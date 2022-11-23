const jwt = require("jsonwebtoken");
const User = require("../model/user");
const config = process.env;


const auth = async (req, res, next) => {
    
    try{
      console.log("reqauthorization.....",req.header('Authorization'))
      
     
      const token =  req.header('Authorization').replace('Bearer ', '') || req.body.token.replace('Bearer ', '') || req.query.token.replace('Bearer ', '') ||

      console.log('token...?',token)
    //   console.log('request header....',req.header('Authorization').replace('Bearer ', ''))
      const decoded =jwt.verify(token, process.env.JWT_SECRET)
      console.log("decoded..",decoded)
      const user = await User.findOne({_id: decoded._id, 'tokens.token':token})
      //console.log("user..",user)
      // console.log("decoded idd.....",decoded._id)
      // console.log("auth user",user)
      if(!user) {
          throw new Error()
      }

      req.user = user
      next()
    }catch (e) {
      console.log('errror authneticate',e)
      res.status(401).send({error: 'Please authenticate.'})
    }
}


module.exports = auth