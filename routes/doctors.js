const express = require("express");
const router = express.Router();
const asynchandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const { Doctor,validateRegisterUser } =require("../models/Doctor")

// const bcrypt = require(bcryptjs)

router.get('/',(req,res)=>{
    res.send("Hallo");

}
)


router.post('/Adddoctor',asynchandler(async(req,res)=>{
    const {error} = validateRegisterUser(req.body)
    if (error){
        res.status(400).json({message:error.details[0].message})
    }
    let user = await Doctor.findOne({email:req.body.Demail})
    if(user){
        res.status(400).json({message:"The user is already existed"})
    }
    const salt = bcrypt.genSalt(10)
    let hashed_password = await bcrypt.hash(req.body.Dpassword,salt)

    const doctor = new Doctor({
        Dname: req.body.Dname,
        Demail: req.body.Demail,
        Dpassword:hashed_password,
        DSalary:req.body.DSalary,
        Dphone:req.body.Dphone,
        Dsex:req.body.Dsex,
        Daddress:req.body.Daddress,
        Dage:req.body.Dage,
        Specialization:req.body.Specialization,
        dep_id:req.body.dep_id,

    })
    const result = await doctor.save()
    res.status(201).json(result)


    

}
))



module.exports = router;