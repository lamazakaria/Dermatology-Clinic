const express = require("express");
const router = express.Router();
const asynchandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const { Patient,validateRegisterPatient,validateLoginPatient} =require("../models/Patient")
const { Doctor,validateRegisterDoctor,validateLoginDoctor} =require("../models/Doctor")
const { Admin,validateRegisterAdmin,validateLoginAdmin } =require("../models/Admin")
const jwt = require("jsonwebtoken")



router.post("/signup",asynchandler(async(req,res)=>{
    const {error} = validateRegisterPatient(req.body)
    // console.log(req.body)

    if(error)
        res.status(400).json({message:error.details[0].message})

    const salt =  await  bcrypt.genSalt(10)
    const hashed_password = await bcrypt.hash(req.body.password,salt)
 

    const patient_instance = new Patient({ 
        Pname: req.body.name,
        Pemail: req.body.email,
        Ppassword:hashed_password,
        Pphone:req.body.phone,
        Psex:req.body.sex,
        Paddress:req.body.address,
        Page:req.body.age
       

    })

    const result = await patient_instance.save()
    const {Ppassword, ...rest} = result._doc
    
    res.status(201).json({...rest})



}))





 


router.post("/signin",asynchandler(async(req,res)=>{
    const person_type = req.body.person_type
    if(person_type === "doctor")
        {
            const {error}  = validateLoginDoctor(req.body)
            if(error)
                res.status(400).json({message:error.details[0].message})
        
            let doctor_instance = await Doctor.findOne({Demail:req.body.email})
            console.log(doctor_instance)
        
            if(!doctor_instance)
                res.status(400).json({message:"Please Enter Email Correctly"})
        
            const password_match = await bcrypt.compare(req.body.password,doctor_instance.Dpassword)
        
            if(!password_match)
                res.status(400).json({message:"Please Enter Password Correctly"})
            
            const token = jwt.sign({id:doctor_instance._id},process.env.JWT_SECRET_KEY,{
                expiresIn:"7d"
            })
        
            const {Dpassword, ...rest} = doctor_instance._doc
            
        
            res.status(201).json({...rest,token})
        
        }

        
    else{
        if (person_type === "patient")
            {
                const {error}  = validateLoginPatient(req.body)
                if(error)
                    res.status(400).json({message:error.details[0].message})
    
                let patient_instance = await Patient.findOne({Pemail:req.body.email})
                console.log(patient_instance)
    
                if(!patient_instance)
                    res.status(400).json({message:"Please Enter Email Correctly"})
    
                const password_match = await bcrypt.compare(req.body.password,patient_instance.Ppassword)
    
                if(!password_match)
                    res.status(400).json({message:"Please Enter Password Correctly"})
                
                const token = jwt.sign({id:patient_instance._id},process.env.JWT_SECRET_KEY,{
                    expiresIn:"7d"
                })
    
                const {Ppassword, ...rest} = patient_instance._doc
                
    
                res.status(201).json({...rest,token})

            }
        else
        {
            const {error}  = validateLoginAdmin(req.body)
            if(error)
                res.status(400).json({message:error.details[0].message})

            let admin_instance = await Admin.findOne({Aemail:req.body.email})
            console.log(admin_instance)

            if(!admin_instance)
                res.status(400).json({message:"Please Enter Email Correctly"})

            const password_match = await bcrypt.compare(req.body.password,admin_instance.Apassword)

            if(!password_match)
                res.status(400).json({message:"Please Enter Password Correctly"})
            
            const token = jwt.sign({id:admin_instance._id},process.env.JWT_SECRET_KEY,{
                expiresIn:"7d"
            })

            const {Apassword, ...rest} = admin_instance._doc
            

            res.status(201).json({...rest,token})

        }
        }    
            
         

    }    



))







module.exports = router