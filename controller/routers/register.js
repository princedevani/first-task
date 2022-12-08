
exports.userregister = async(req,res) => {

 try {
    const { first_name, last_name, email, password } = req.body;

    if (!(email && first_name && last_name && password)) {
       throw new Error("All input is required");

    }
    //  console.log(first_name.trim().length)
    if (!first_name.trim()) {
       throw new Error("First name is required")
    } else if (!/^[a-zA-Z ]*$/.test(first_name)) {
       throw new Error("First name is not valid")
    } else if (!validator.isLength(first_name, { min: 3, max: 25 })) {
       throw new Error("First name should contain 3 to 25 characters.")
    }


    if (!last_name.trim()) {
       throw new Error("last name is required")
    } else if (!/^[a-zA-Z ]*$/.test(last_name)) {
       throw new Error("last name is not valid")
    } else if (!validator.isLength(last_name, { min: 3, max: 25 })) {
       throw new Error("last name should contain 3 to 25 characters.")
    }



    if (!email.trim()) {
       throw new Error("email is required")
    } else if (!/^[a-z0-9]+(([.+_-]?[a-z0-9]+)+)?@[a-z]{2,5}[.][a-z]{2,4}$/.test(email)) {
       throw new Error("email is not valid")
    } else if (!validator.isLength(last_name, { min: 1, max: 250 })) {
       throw new Error("email should contain 1 to 250 characters.")
    }




    const oldUser = await User.findOne({ email });
    //  console.log('olduser....',oldUser)    old user male 

    if (oldUser) {
       return res.status(409).send("User is already exitst. Please login");
    }

    encryptedPassword = await bcrypt.hash(password, 8);
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

    res.status(201).json({ user, token });
    console.log('reponse..', { user, token })
 } catch (error) {
    console.log(error)
    res.send({ error: error.message })
 }
}