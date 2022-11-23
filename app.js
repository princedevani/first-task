const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require("./middleware/auth");
const User = require("./model/user");
require('dotenv').config();
require("./config/database").connect();

const express = require('express');
const { ConnectionStates } = require("mongoose");


const app = express();




app.use(express.json());



   app.post("/register", async(req, res) => {
          try {
            const {first_name, last_name, email, password } = req.body;

             if(!(email && first_name && last_name && password)) {
                throw new Error("All input is required");
             }

             const oldUser = await User.findOne({ email }); 
            //  console.log('olduser....',oldUser)    old user male 

             if(oldUser) {
                return res.status(409).send("User is already exitst. Please login");
             }

             encryptedPassword = await bcrypt.hash(password, 10);
            //  console.log('password',encryptedPassword)

             const user = await User.create({
                first_name,
                last_name,
                email: email.toLowerCase(),
                password: encryptedPassword,
             });

                    const token = await user.generateAuthToken()

            //  const token = jwt.sign({_id: user._id, email },
            //     'jwtproject',
            //  );

            //  user.token = token;

             res.status(201).json({user,token});
             console.log('reponse..',{user,token})
          } catch (error) {
            res.send({error: error.message})
          }
     })


   
   app.post("/login", async(req, res) => {
       try {
         const {email, password } = req.body;

         if(!(email && password)) {
            res.status(400).send("All input is required");
         }
        const user = await User.findOne({ email });

      if(user && (await bcrypt.compare(password, user.password))) {

         // const token = jwt.sign({_id: user._id, email },
         //    'jwtproject',
         // );
         // user.token = token;
         const token = await user.generateAuthToken()

         res.status(200).json({user,token});
         // console.log('login user..',user)  
      }  
        else{
       res.status(400).send("invalid credentials")
        }
       } catch (error) {
         console.log(error);
       }
     
})
app.get('/getuser', auth,  async(req, res) => {
   try {
      //  const user = await User.findByCredentials(req.body.email, req.body.password)
      //  const token = await user.generateAuthToken()
       res.send(req.user)
   }catch (e) {
      
       console.log('errror..',e)
       res.status(400).send()
   }
})

 app.get('/users/:id',(req, res) => {
   const _id = req.params.id
   //   console.log(req.params)

   User.findById(_id).then((user) => {
       if(!user) {
            return res.status(404).send()
       }
       res.send(user)
   }).catch((e) => {
       console.log(e)
       res.status(500).send()
   })
})

app.delete('/userdelete', auth, async(req, res) => {
   try {
      req.user.remove()
      res.send(req.user)
   } catch (error) {
      console.log('errror......',error)
      //   res.status(500).send(e) 
   }

})
 
module.exports = app;