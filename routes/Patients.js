const express = require("express");
const router = express.Router();
const asynchandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const{Patient,validateUpdatePatient}=require("../models/Patient")
const {Prescripition}=require("../models/Prescripition")
const {Appointment, validateUpdateAppointment,validateRegisterAppointment}=require("../models/Appointment")
const{verfiy_token_and_authentication}=require("../middlewares/verfiyToken")
const { Billing, validateRegisterBilling,validatePatientId} = require("../models/Billing")
const { Doctor} =require("../models/Doctor")
const { Service,validateRegisterService} = require("../models/Service")
const{Time,validateRegisterTime}=require("../models/Time")


/* 
@decs : Update patient 
@path : home/patinet/id
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

router.get("/:id/prescription",asynchandler(async(req,res)=>{
    const prescripition_instance=await Prescripition.findOne({pat_id:req.params.id});
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
    const appointment_instance=await Appointment.findOne({pat_id:req.params.id})
    if(appointment_instance){
        res.status(200).json(appointment_instance)
    }
    else{
        res.status(404).json({massage:"This patient has not yet booked an appointment"});
    }
}))








/* 
@decs : Update appointment 
@path : home/patinet/id/appointment
@method : put
*/

router.put("/:id/appointment",verfiy_token_and_authentication,asynchandler(async(req,res)=>{
    const {error}=validateUpdateAppointment(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }
    let appointment_info=await Appointment.findOne({$and:[{pat_id:req.params.id},{Dname:req.body.Dname}]})
    if(!appointment_info){
        res.status(404).json({ message: "This Appointment not found" });

    }
    const updatedPatinet=await Appointment.findOneAndUpdate({$and:[{pat_id:req.params.id},{Dname:req.body.Dname}]},{
        $set:{
            fees:req.body.fees, 
            // Dname:req.body.Dname,
            Time: req.body.Time,
            specialty:req.body.specialty
        }

    },{new:true}).select()
    res.status(200).json(updatedPatinet);

}))


/**
 * @desc  Cancel appointments
 * @method delete 
 * @path home/patinet/id/appointment 
 */

// this if he will book for 2 dictors for example 
router.delete("/:id/appointment",verfiy_token_and_authentication,asynchandler(async(req,res)=>{
    let appointment_details=await Appointment.findOne({$and:[{pat_id:req.params.id},{doc_id:req.body.doc_id}]})
    if(appointment_details){
        let appointment_instance = await Appointment.findOneAndDelete({$and:[{pat_id:req.params.id},{doc_id:req.body.doc_id}]})
        
        console.log(appointment_instance)
        res.status(201).json({message:"A Appointment is Canceled"})
    }
    else{
        res.status(404).json({ message: "No appointment found for the patient with the specified doctor" });
    }
    
}))



/**
 * @desc  book service
 * @method post
 * @path home/patient/id/services
 
 */
router.post("/:id/services",verfiy_token_and_authentication,asynchandler(async(req,res)=>{
    const{error} = validateRegisterService(req.body)
    if(error)
        res.status(400).json({message:error.details[0].message})

    const service_schema  = await Service.find({service:req.body.service})
    const billing_schema = await Billing.findOne({pat_id:req.params.id})
    if(!billing_schema)
        { 
            let body ={
                pat_id:req.params.id,
                services:[
                    {
                        id:(service_schema[0]._id).toString(),
                        Service:service_schema[0].service,
                        fees:service_schema[0].fees
                    }
                ],
                Total_Amount:service_schema[0].fees,
            

            }
            const{error} = validateRegisterBilling(body)
            if(error)
                res.status(400).json({message:error.details[0].message})

            const new_billing = new Billing(body)
            let docs = await new_billing.save()
            res.status(200).json({message:"Service is booked",docs:docs._doc})



        }
    else{
        let total_amount = 0
        let services_array = billing_schema.services
        services_array.push({
            id:service_schema[0]._id,
            Service:service_schema[0].service,
            fees:service_schema[0].fees
        })
       // add new fees
        for(let i=0; i< services_array.length;i++){
            total_amount += services_array[i].fees
            
        }

        const billing_instance = await Billing.findOneAndUpdate({pat_id:req.params.id},{
            $set:{
                services:services_array,
                Total_Amount:total_amount

            }
        },{new:true})

        res.status(200).json({message:"Service is booked",billing_instance})



    }    
   

}))

/**
 * @desc  show biling
 * @method post
 * @path home/patient/id/billing
 
 */
router.get("/:id/billing",verfiy_token_and_authentication,asynchandler(async(req,res)=>{
    const billing_instance = await Billing.find({pat_id:req.params.id})
    let total_amount = 0
    var docs;

    const patient_instance = await Patient.findById(req.params.id,'Pname')
    if(!patient_instance)
        res.status(400).json({message:"Please Enter ID Correctly"})
    
    // get appointments
    const appointment_instance = await Appointment.find({pat_id:req.params.id})
   

    // get fees of services
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
                pat_id:req.params.id,
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
                
                pat_id:req.params.id,
                patient_name: patient_instance.Pname,
                services: billing_instance[0].services,
                total_amount : total_amount

        }

        console.log(docs)
    }    
        

    res.status(200).json(docs)

}))

/**
 * @desc  book Appointment
 * @method post 
 * @path home/patient/id/appointment 
 */
router.post("/:id/appointment", verfiy_token_and_authentication, asynchandler(async (req, res) => {
    
        const { error } = validateRegisterAppointment(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Check if appointment already exists for the patient
        const existingAppointment = await Appointment.findOne({$and: [
            {pat_id: req.params.id},
            {Dname: req.body.Dname},
            {"Time.Day": req.body.Day},
            {"Time.start": req.body.start},
           { "Time.end": req.body.end}
        ]});

        if (existingAppointment) {
            return res.status(400).json({ message: "This appointment is already booked." });
        }

        // Check if patient exists
        const patientInstance = await Patient.findById(req.params.id);
        if (!patientInstance) {
            return res.status(400).json({ message: "Patient not found." });
        }

        // Check if doctor exists
        const doctorInstance = await Doctor.findOne({ Dname: req.body.Dname });
        if (!doctorInstance) {
            return res.status(400).json({ message: "Doctor not found." });
        }
        const doctorTimeSlots = await Time.findOne({
            doc_id: doctorInstance._id
        });
        const { Day, start, end } = req.body.Time;
        const slot_availabilaty="valid"
        let matchingSlot = doctorTimeSlots.slots.find(slot =>
            slot.Day === Day &&
            slot.start === start &&
            slot.end === end &&
            slot.Status===slot_availabilaty
        );
        console.log("Matching Slot", matchingSlot);
        if (! matchingSlot) {
            return res.status(400).json({ message: "The selected time slot is not available." });
        }
        doctorTimeSlots.NumofReservations++
        await doctorTimeSlots.save();
        

        // Update the time slot status to mark it as invalid
        const updatedTimeSlot = await Time.findOneAndUpdate(
            {
                doc_id: doctorInstance._id,
                "slots.Day": req.body.Time.Day,
                "slots.start": req.body.Time.start,
                "slots.end": req.body.Time.end,
                "slots.Status": "valid"
            },
            { $set: { "slots.$.Status": "invalid" } },
            { new: true }
        );

        // Create and save the appointment
        const appointmentInstance = new Appointment({
            fees: req.body.fees,
            Dname: req.body.Dname,
            pat_id: req.params.id,
            specialty: req.body.specialty,
            Time: {
                Day: req.body.Day,
                start: req.body.start,
                end: req.body.end
            }
        });
        const appointmentDetails = await appointmentInstance.save();
        res.status(200).json(appointmentDetails);
    
}));



module.exports=router