exports.getuserbyid = async(req,res) => {

    const _id = req.params.id
    //   console.log(req.params)
 
    User.findById(_id).then((user) => {
       if (!user) {
          return res.status(404).send()
       }
       res.send(user)
    }).catch((e) => {
       console.log(e)
       res.status(500).send()
    })
 }