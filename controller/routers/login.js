
exports.userlogin = async(req,res) => {
 try {
    const { email, password } = req.body;

    if (!(email && password)) {
       res.status(400).send("All input is required");
    }
    const user = await User.findOne({ email });

    // console.log("user..",user)
    // console.log("...", bcrypt.compare(password, user.password))
    // console.log(",,,,,",password)
    // console.log("/////",user.password)


    if ((user) && (bcrypt.compare(password, user.password))) {

       // const token = jwt.sign({_id: user._id, email },
       //    'jwtproject',
       // );
       // user.token = token;
       const token = await user.generateAuthToken()

       res.status(200).json({ user, token });
       // console.log('login user..',user)  
    }
    else {
       res.status(400).send("invalid credentials")
    }
 } catch (error) {
    console.log(error);
 }

}