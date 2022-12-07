const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { 
    type: String, 
    default: null 
},
  last_name: 
  { type: String, 
    default: null 
},
  email: 
  { type: String,
     unique: true 
    },
  password: 
  {
     type: String 
},
tokens: [{
  token: {
      type: String,
      
  }
}]
});


userSchema.statics.findByCredentials= async (email, password) => {
  console.log("email..",email)  // email male 
  const user = await User.findOne({email})
  console.log("user..",user)   // user male all details

  if (!user) {
      throw new Error('User not found')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if(!isMatch) {
      throw new Error('Password is incorrect')
  }

  return user
}


userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET)
  user.tokens = user.tokens.concat({ token })
  
  await user.save()
  
  return token
}

userSchema.pre('save', async function (next) {
  const user = this 

  // console.log('just before saving!')
  if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8)
  }
   
  next()
})





const User = mongoose.model('User', userSchema) 
module.exports = User