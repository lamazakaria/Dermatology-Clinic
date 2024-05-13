const express = require("express");
const router = express.Router();
const asynchandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const{Patient,validateUpdatePatient}=require("../models/Patient")
const {Prescripition}=require("../models/Prescripition")
const {Appointment}=require("../models/Appointment")
const{verfiy_token_and_authentication}=require("../middlewares/verfiyToken")


/* 
@decs : Update patient 
@path : home/patinet
@method : put
*/

router.put("/:id",verfiy_token_and_authentication,asynchandler(async(req,res)=>{
    const {error}=validateUpdatePatient(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }
    if(req.body.password){
        const salt=await bcrypt.genSalt(10);
        req.body.password=await bcrypt.hash(req.body.password,salt);
    }
    console.log(req.headers);
    const updatedPatinet=await Patient.findByIdAndUpdate(req.params.id,{
        $set:{
        Pname:req.body.name, 
        Pphone:req.body.phone,
        Paddress:req.body.address,
        Page:req.body.age,
        Pemail: req.body.email,
        Ppassword:req.body.password
        }

    },{new:true}).select("-Ppassword");
    res.status(200).json(updatedPatinet);
}))


/* 
@decs : get user by id
@path : home/patinet/:id
@method : put
*/

router.get('/:id',verfiy_token_and_authentication,asynchandler(async(req,res)=>{
    const patinet_instant= await Patient.findById(req.params.id).select("-password");
    if(patinet_instant){
        res.status(200).json(patinet_instant);
    }
    else{
        res.status(404).json({massage:"not found"});
    }
}))


/**
 * @desc  get data of prescription
 * @method get
 * @path home/patinet/id/prescription 
 */

router.get("/:id/prescription",verfiy_token_and_authentication,asynchandler(async(req,res)=>{
    const prescripition_instance=await Prescripition.findOne(req.body.id);
    console.log(prescripition_instance)
    if(prescripition_instance){
        res.status(200).json(prescripition_instance)
    }
    else{
        res.status(404).json({massage:"Prescriptions not found for this patient"});
    }
}))

/**
 * @desc  get appointment of patinet
 * @method get
 * @path home/patinet/id/appointment 
 */

router.get("/:id/appointment",verfiy_token_and_authentication,asynchandler(async(req,res)=>{
    const appointment_instance=await Appointment.findOne(req.body.id)
    if(appointment_instance){
        res.status(200).json(appointment_instance)
    }
    else{
        res.status(404).json({massage:"This patient has not yet booked an appointment"});
    }
}))


module.exports=router