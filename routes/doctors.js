const express = require("express");
const router = express.Router();
const asynchandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const { Patient,validateRegisterPatient,validateLoginPatient} =require("../models/Patient")
const { Doctor,validateRegisterDoctor,validateUpdateDoctor} =require("../models/Doctor")
const { Admin } =require("../models/Admin") 
const { Nurse,validateRegisterNurse,validateUpdateNurse } = require("../models/Nurse")
const { Prescripition,validatePrescripition,validateUpdatePrescripition} = require("../models/Prescripition")
const{Appointment} = require("../models/Appointment")
const { verfiy_token, verfiy_token_and_authentication,  verfiy_isAdmin} = require("../middlewares/verfiyToken")
const {  MedicalRecord, validateRegisterMedicalRecord} = require("../models/MedicalRecord")


/**
 * @desc show doctor profile
 * @method get 
 * @path home/doctor/id 
 */

router.get("/:id",verfiy_token_and_authentication,asynchandler(async(req,res)=>{
    let doctor_instance = await Doctor.findById(req.params.id)
    res.status(201).json(doctor_instance)
    

}))


/**
 * @desc  add data of prescription
 * @method post 
 * @path home/doctor/id/prescription 
 */

router.post("/:id/prescription",verfiy_token_and_authentication,asynchandler(async(req,res)=>{
    req.body.doc_id = req.params.id
    const{notes,...other} = req.body 
    const {error} = validatePrescripition({doc_id:req.body.doc_id,...other})
    if(error)
        res.status(400).json({message:error.details[0].message})
    let patient_instance = await Patient.findById(req.body.pat_id)
    if(!patient_instance)
        res.status(400).json({message:"This ID is inavaliable, Please Enter ID Correctly"})


    const prescripition_instance = new Prescripition({
        Dosage: req.body.Dosage,
        Nameofmedicine: req.body.Nameofmedicine,
        contraindictions:req.body.contraindictions,
        Disease:req.body.Disease,
        doc_id:req.params.id,
        pat_id:req.body.pat_id

    })


    const docs = await prescripition_instance.save()
    console.log(docs)
    // add data to medical record
 
    let get_medical_records = await MedicalRecord.findOne({pat_id:req.body.pat_id})
    if(get_medical_records)
        {   let diagnosis_list =  get_medical_records.diagnosis
            let prescription_list = get_medical_records.prescriptions
            diagnosis_list.push(req.body.Disease)
            prescription_list.push({ dosage:req.body.Dosage, medication:req.body.Nameofmedicine})
            const medical_records_updated = await MedicalRecord.findOneAndUpdate({pat_id:req.body.pat_id},{
                $set:{
                    diagnosis:diagnosis_list,
                    prescriptions:prescription_list,
                    notes:req.body.notes


                }
            },{new:true})  
            console.log(medical_records_updated)

        }
    else{
        let medical_record_data ={
            pat_id:req.body.pat_id,
            diagnosis:[req.body.Disease],
            prescriptions:[{
                dosage:req.body.Dosage,
                medication:req.body.Nameofmedicine

            }],
            notes:req.body.notes

            
        }
        const {error_data} = validateRegisterMedicalRecord(medical_record_data)
        if(error_data)
            res.status(400).json({message:error_data.details[0].message})
    
        let medical_record_instance = new MedicalRecord(medical_record_data)
        const medical_docs = await medical_record_instance.save()
        console.log(medical_docs)

    }    
   

    
    res.status(201).json(docs)
    

}))


/**
 * @desc  get data of medical_records
 * @method: post
 * @path home/doctor/id/medicalrecord 
 */
router.post("/:id/medicalrecord",verfiy_token_and_authentication,asynchandler(async(req,res)=>{
    let get_medical_records = await MedicalRecord.findOne({pat_id:req.body.pat_id})
    if(!get_medical_records)
        res.status(201).json({message:"Patient do not have any Medical Records"})
    const{visitDate,...other} = get_medical_records
    let date = visitDate.toLocaleDateString()
    let patient_instance = await Patient.findOne({_id:req.body.pat_id}).select('Pname Page Psex Pphone')

    res.status(201).json({date,patient_instance,...other})


}))

/**
 * @desc  get appointments
 * @method Get 
 * @path home/doctor/id/appointments 
 */
router.get("/:id/appointment",verfiy_token_and_authentication,asynchandler(async(req,res)=>{
    let appointment_instance = await Appointment.find({doc_id:req.params.id})
    if(!appointment_instance)
        res.status(201).json({message:"You don't have any appointments"})

    // loop for appointments for each doctor
    let appointment_list = []
    for(let i =0; i < appointment_instance.length;i++)
        {
            const{Time,pat_id} = appointment_instance[i]
            let patient_instance = await Patient.findById(pat_id).select('Pname Pemail Pphone Psex Page')
            console.log(patient_instance)
            appointment_list.push({Time,patient_instance})

        }

    res.status(201).json(appointment_list)
    
}))

/**
 * @desc  Cancel appointments
 * @method delete 
 * @path home/doctor/id/appointments 
 */
router.delete("/:id/appointment",verfiy_token_and_authentication,asynchandler(async(req,res)=>{
    let appointment_instance = await Appointment.findOneAndDelete({$and:[{doc_id:req.params.id},{pat_id:req.body.pat_id}]})
    console.log(appointment_instance)
    res.status(201).json({message:"A Appointment is Canceled"})
    
}))






module.exports = router;