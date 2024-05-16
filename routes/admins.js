const express = require("express");
const router = express.Router();
const asynchandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const { Patient,validateRegisterPatient,validateLoginPatient} =require("../models/Patient")
const { Doctor,validateRegisterDoctor,validateUpdateDoctor} =require("../models/Doctor")
const { Admin } =require("../models/Admin") 
const { Nurse,validateRegisterNurse,validateUpdateNurse } = require("../models/Nurse")
const { Device,validateRegisterDevice,validateUpdateDevice} = require("../models/Device")
const {Dep} = require("../models/Department")
const { verfiy_token, verfiy_token_and_authentication,  verfiy_isAdmin} = require("../middlewares/verfiyToken")
const { Billing, validateUpdateBilling,validatePatientId} = require("../models/Billing")
const {Appointment} = require("../models/Appointment")
 
/* 
@path : admin profile
@method : get 
*/

router.get('/:id',verfiy_token_and_authentication,asynchandler(async(req,res)=>{
    let admin_instance = await Admin.findById(req.params.id)
    console.log(admin_instance)

    const{Apassword, ...rest} = admin_instance._doc

    res.status(201).json({...rest})
    
}
))



/* 
@desc: show all patients
@path : admin profile
@method : get 
*/

router.get('/:id/patients',verfiy_token_and_authentication,asynchandler(async(req,res)=>{
    let patient_instance = await Patient.find()
    console.log(patient_instance)

    

    res.status(201).json(patient_instance)
    
}
))

/* 
@decs : delete patient
@path : admin/patients
@method : delete
*/

router.delete("/:id/patients",verfiy_isAdmin,asynchandler(async(req,res)=>{
    if(!req.body.id)
        res.status(403).json({message:"ID is Required"})
    let patient_instance = await Patient.findByIdAndDelete(req.body.id)
    res.status(201).json({message:"Deletion is success"})



}))




/* 
@decs : ADD doctor
@path : admin/doctors
@method : post
*/


router.post('/:id/doctors',verfiy_isAdmin,asynchandler(async(req,res)=>{
    const {error} = validateRegisterDoctor(req.body)
    if (error){
        res.status(400).json({message:error.details[0].message})
    }
    let user = await Doctor.findOne({email:req.body.email})
    // console.log(user)
    if(user){
        res.status(400).json({message:"The user is already existed"})
    }
    const salt = await bcrypt.genSalt(10)
    let hashed_password = await bcrypt.hash(req.body.password,salt)

    let dep_instance = await Dep.findById(req.body.dep_id)
    if(!dep_instance)
        res.status(400).json({message:"This Department ID is inavaliable, Please Enter  Department ID Correctly"})


    const doctor_instance = new Doctor({
        Dname: req.body.name,
        Demail: req.body.email,
        Dpassword:hashed_password,
        DSalary:req.body.Salary,
        Dphone:req.body.phone,
        Dsex:req.body.sex,
        Daddress:req.body.address,
        Dage:req.body.age,
        Specialization:req.body.Specialization,
        dep_id:req.body.dep_id
       
    })
    const result = await doctor_instance.save()
    const {Dpassword, ...other} = result._doc
    res.status(201).json({...other})


    

}
))

/* 
@decs : delete doctor
@path : admin/doctors
@method : delete
*/

router.delete("/:id/doctors",verfiy_isAdmin,asynchandler(async(req,res)=>{
    if(!req.body.id)
        res.status(403).json({message:"ID is Required"})
    let doctor_instance = await Doctor.findByIdAndDelete(req.body.id)
    console.log(doctor_instance)
    res.status(201).json({message:"Deletion is success"})



}))

/* 
@decs : Update doctor
@path : admin/doctors
@method : put
*/

router.put("/:id/doctors",verfiy_isAdmin,asynchandler(async(req,res)=>{
    if(!req.body.id)
        res.status(403).json({message:"ID is Required"})
    const {id,...body} = req.body
    const {error} = validateUpdateDoctor({...body})
    if(error)
        res.status(400).json({message:error.details[0].message})
    
    // // check Email is unique
    if(req.body.email)
        {
            let user = await Doctor.findOne({email:req.body.email})
            // console.log(user)
            if(user){
                res.status(400).json({message:"This Email is already existed"})
            }

        }
    
    // check ID is existed or not
    let id_existed = await Doctor.findById(req.body.id)
    if(!id_existed){
        res.status(400).json({message:"Please Enter ID Correctly"})
    }

    const salt = await bcrypt.genSalt(10)
    let hashed_password = await bcrypt.hash(req.body.password,salt)
    let dep_instance = await Dep.findById(req.body.dep_id)
    if(!dep_instance)
        res.status(400).json({message:"This Department ID is inavaliable, Please Enter  Department ID Correctly"})

    

    //update doctor 
    let doctor_instance = await Doctor.findByIdAndUpdate(req.body.id,{
        $set:{
            Dname: req.body.name,
            Demail: req.body.email,
            Dpassword:hashed_password,
            DSalary:req.body.Salary,
            Dphone:req.body.phone,
            Dsex:req.body.sex,
            Daddress:req.body.address,
            Dage:req.body.age,
            Specialization:req.body.Specialization,
            dep_id:req.body.dep_id

        }
    },
    {new:true}).select("-Dpassword")
    console.log(doctor_instance)
    res.status(201).json({message:"User is updated",doctor_instance})

}))


/* 
@desc: show all doctors
@path : /id/doctors
@method : get 
*/

router.get('/:id/doctors',verfiy_token_and_authentication,asynchandler(async(req,res)=>{
    let doctor_instance = await Doctor.find()
    console.log(doctor_instance)

    

    res.status(201).json(doctor_instance)
    
}
))


/* 
@decs : ADD nurses
@path : admin/nurses
@method : post
*/


router.post('/:id/nurses',verfiy_isAdmin,asynchandler(async(req,res)=>{
    const {error} = validateRegisterNurse(req.body)
    if (error){
        res.status(400).json({message:error.details[0].message})
    }
    let user = await Nurse.findOne({email:req.body.email})
    // console.log(user)
    if(user){
        res.status(400).json({message:"The user is already existed"})
    }
    let doctor_instance = await Doctor.findById(req.body.doctor_id)
    if(!doctor_instance)
        res.status(400).json({message:"This Doctor ID is unavaliable, Please Enter  Doctor ID Correctly"})

   
    const nurse_instance = new Nurse({
        Nname: req.body.name,
        Nemail: req.body.email,
        NSalary:req.body.Salary,
        Nphone:req.body.phone,
        Nsex:req.body.sex,
        Naddress:req.body.address,
        Nage:req.body.age,
        doctor_id:req.body.doctor_id
       
    })
    const result = await nurse_instance.save()
    res.status(201).json(result._doc)


    

}
))


/* 
@decs : delete nurse
@path : admin/nurses
@method : delete
*/

router.delete("/:id/nurses",verfiy_isAdmin,asynchandler(async(req,res)=>{
    if(!req.body.id)
        res.status(403).json({message:"ID is Required"})
    let nurse_instance = await Nurse.findByIdAndDelete(req.body.id)
    console.log(nurse_instance)
    res.status(201).json({message:"Deletion is success"})



}))


/* 
@decs : Update nurse
@path : admin/nurses
@method : put
*/

router.put("/:id/nurses",verfiy_isAdmin,asynchandler(async(req,res)=>{
    if(!req.body.id)
        res.status(403).json({message:"ID is Required"})
    const {id,...body} = req.body
    const {error} = validateUpdateNurse({...body})
    if(error)
        res.status(400).json({message:error.details[0].message})
    
    // // check Email is unique
    if(req.body.email)
        {
            let user = await Nurse.findOne({email:req.body.email})
            // console.log(user)
            if(user){
                res.status(400).json({message:"This Email is already existed"})
            }

        }
    
    // check ID is existed or not
    let id_existed = await Nurse.findById(req.body.id)
    if(!id_existed){
        res.status(400).json({message:"Please Enter ID Correctly"})
    }
    let doctor_instance = await Doctor.findById(req.body.doctor_id)
    if(!doctor_instance)
        res.status(400).json({message:"This Doctor ID is unavaliable, Please Enter  Doctor ID Correctly"})
    

    //update doctor 
    let nurse_instance = await Nurse.findByIdAndUpdate(req.body.id,{
        $set:{
            Nname: req.body.name,
            Nemail: req.body.email,
            NSalary:req.body.Salary,
            Nphone:req.body.phone,
            Nsex:req.body.sex,
            Naddress:req.body.address,
            Nage:req.body.age,
            doctor_id:req.body.doctor_id
           

        }
    },
    {new:true})
    console.log(nurse_instance)
    res.status(201).json({message:"User is updated",nurse_instance})

}))
/* 
@desc: show all nurses
@path : /id/nurses
@method : get 
*/

router.get('/:id/nurses',verfiy_token_and_authentication,asynchandler(async(req,res)=>{
    let nurse_instance = await Nurse.find()
    console.log(nurse_instance)

    

    res.status(201).json(nurse_instance)
    
}
))



/* 
@decs : ADD device
@path : admin/devices
@method : post
*/


router.post('/:id/devices',verfiy_isAdmin,asynchandler(async(req,res)=>{
    const {error} = validateRegisterDevice(req.body)
    if (error){
        res.status(400).json({message:error.details[0].message})
    }
    let docs = await Device.findOne({Code:req.body.Code})
    if(docs)
        res.status(400).json({message:"Code must be Unique"})

    let dep_instance = await Dep.findById(req.body.dep_id)
    if(!dep_instance)
        res.status(400).json({message:"This Department ID is inavaliable, Please Enter  Department ID Correctly"})
   
    const device_instance = new Device({
        Code:req.body.Code,
        PPM: req.body.PPM,
        Manufacturer: req.body.Manufacturer,
        dep_id:req.body.dep_id

       
       
    })
    const result = await device_instance.save()
    res.status(201).json(result._doc)


    

}
))

/* 
@decs : delete device
@path : admin/devices
@method : delete
*/

router.delete("/:id/devices",verfiy_isAdmin,asynchandler(async(req,res)=>{
    if(!req.body.id)
        res.status(403).json({message:"ID is Required"})
    let device_instance = await Device.findByIdAndDelete(req.body.id)
    console.log(device_instance)
    res.status(201).json({message:"Deletion is success"})



}))


/* 
@decs : Update device
@path : admin/devices
@method : put
*/

router.put("/:id/devices",verfiy_isAdmin,asynchandler(async(req,res)=>{
    if(!req.body.id)
        res.status(403).json({message:"ID is Required"})
    const {id,...body} = req.body
    const {error} = validateUpdateDevice({...body})
    if(error)
        res.status(400).json({message:error.details[0].message})
    
    // // check Code is unique
    if(req.body.Code)
        {
            let docs = await Device.findOne({Code:req.body.Code})
            // console.log(user)
            if(docs){
                res.status(400).json({message:"This Code is already existed"})
            }

        }

     let dep_instance = await Dep.findById(req.body.dep_id)
    if(!dep_instance)
        res.status(400).json({message:"This Department ID is inavaliable, Please Enter  Department ID Correctly"})   

    
    // check ID is existed or not
    let id_existed = await Device.findById(req.body.id)
    if(!id_existed){
        res.status(400).json({message:"Please Enter ID Correctly"})
    }


    //update device 
    let device_instance = await Device.findByIdAndUpdate(req.body.id,{
        $set:{
            Code:req.body.Code,
            PPM: req.body.PPM,
            Manufacturer: req.body.Manufacturer,
            dep_id:req.body.dep_id
           

        }
    },
    {new:true})
    console.log(device_instance)
    res.status(201).json({message:"User is updated",device_instance})

}))

/* 
@desc: show all devices
@path : /id/devices
@method : get 
*/

router.get('/:id/devices',verfiy_isAdmin,asynchandler(async(req,res)=>{
    let device_instance = await Device.find()
    console.log(device_instance)

    

    res.status(201).json(device_instance)
    
}
))


/**
 * @desc show billing's patient
 * @method  get
 * @route /admin/:id/billings
 * 
 */

router.post("/:id/billings",verfiy_isAdmin,asynchandler(async(req,res)=>{
    let total_amount = 0
    var docs;
    //verfiy patient id
    const {error} = validatePatientId(req.body)
    if(error)
        res.status(400).json({message:error.details[0].message})

   

    const patient_instance = await Patient.findById(req.body.pat_id,'Pname')
    if(!patient_instance)
        res.status(400).json({message:"Please Enter ID Correctly"})
    
    // get appointments
    const appointment_instance = await Appointment.find({pat_id:req.body.pat_id})
   

    // get fees of services
    const billing_instance = await Billing.find({pat_id:req.body.pat_id})
    total_amount = billing_instance[0].Total_Amount
    let date = billing_instance[0].Date.toLocaleDateString()
    
    console.log(date)

   

    
        

    // get fees of appointment
    if(appointment_instance.length > 0)
        {  

                    
            // get name of doctor 
            let doc_id = appointment_instance[0].doc_id
            const doctor_instance = await Doctor.findById(doc_id,'Dname')
    
            total_amount += appointment_instance[0].fees
            docs = {
                Date: date,
                pat_id:req.body.pat_id,
                patient_name: patient_instance.Pname,
                doctor_name : doctor_instance.Dname,
                Time:appointment_instance[0].Time,
                appointment_fees:appointment_instance[0].fees,
                services: billing_instance[0].services,
                total_amount : total_amount


            }

        }
    else{
        console.log(patient_instance)
        docs ={  Date: date,
                
                pat_id:req.body.pat_id,
                patient_name: patient_instance.Pname,
                services: billing_instance[0].services,
                total_amount : total_amount

        }

        console.log(docs)
    }    
        

    res.status(200).json(docs)







}))


/**
 * @desc add payment method
 * @method  put
 * @route /admin/:id/billings
 * 
 */

router.put("/:id/billings",verfiy_isAdmin,asynchandler(async(req,res)=>{
   const { error } = validateUpdateBilling({ Payment_Method: req.body.payment_method });

    if(error)
        res.status(400).json({message:error.details[0].message})

    const billing_instance = await Billing.findOneAndUpdate({pat_id:req.body.pat_id},{
        $set:{
            Payment_Method: req.body.payment_method
        }
    },{new:true})



    res.status(201).json({message:"Payment Successful",billing_instance})

}))




module.exports = router;