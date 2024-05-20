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
const{Dep}=require("../models/Department")
const {  MedicalRecord, validateRegisterMedicalRecord} = require("../models/MedicalRecord")

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
 * @desc  get data of medical records
 * @method get
 * @path home/patinet/id/medicalrecord
 */

router.get("/:id/medicalrecord",asynchandler(async(req,res)=>{
    let medical_record_instance = await MedicalRecord.findOne({pat_id:req.params.id})
    if(!medical_record_instance)
        res.status(201).json({message:"You don't have any Medical Records"})
    res.status(201).json(medical_record_instance)
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
    let appointment_info=await Appointment.findOne({$and:[{pat_id:req.params.id},{doc_id:req.body.doc_id}]})
    if(!appointment_info){
        res.status(404).json({ message: "This Appointment not found" });

    }
    // If time slot is being updated, check availability and update the time slot status
    const { Day, start, end } = req.body.Time;
    if (Day !== appointment_info.Time.Day || start !== appointment_info.Time.start || end !== appointment_info.Time.end) {
        const doctorInstance = await Doctor.findById(req.body.doc_id);
        const doctorTimeSlots = await Time.findOne({
            doc_id: req.body.doc_id
        });
        console.log("appointment_info.Time.Day",appointment_info.Time.Day)
        console.log("appointment_info.Time.start",appointment_info.Time.start)
        console.log("appointment_info.Time.end",appointment_info.Time.end)

        // Mark the old time slot as valid
        await Time.findOneAndUpdate(
            {
                doc_id: req.body.doc_id,
                "slots.Day": appointment_info.Time.Day,
                "slots.start": appointment_info.Time.start,
                "slots.end": appointment_info.Time.end,
                "slots.Status": "invalid"
            },
            { $set: { "slots.$.Status": "valid" } },
            { new: true },

            
        );

        // Check if the new slot is available
        let matchingSlot = doctorTimeSlots.slots.find(slot =>
            slot.Day === Day &&
            slot.start === start &&
            slot.end === end &&
            slot.Status === "valid"
        );

        if (!matchingSlot) {
            return res.status(400).json({ message: "The selected time slot is not available." });
        }

        // Mark the new time slot as invalid
        await Time.findOneAndUpdate(
            {
                doc_id: req.body.doc_id,
                "slots.Day": Day,
                "slots.start": start,
                "slots.end": end,
                "slots.Status": "valid"
            },
            { $set: { "slots.$.Status": "invalid" } },
            { new: true }
        );
        // Update the appointment details
        const updatedAppointment = await Appointment.findOneAndUpdate(
        {$and: [{ pat_id: req.params.id },{doc_id:req.body.doc_id }]},
        {
            $set: {
                fees: req.body.fees,
                Time: {
                    Day: req.body.Time.Day,
                    start: req.body.Time.start,
                    end: req.body.Time.end
                }
            }
        },
        { new: true }
    );

        res.status(200).json(updatedAppointment);

        // doctorTimeSlots.NumofReservations++;
        // await doctorTimeSlots.save();
    }
    else{
        return res.status(400).json({ message: "No changes were made to the appointment.The new appointment is the same as the current appointment." });
    }

    
}));


/**
 * @desc  Cancel appointments
 * @method DELETE 
 * @path home/patient/appointment/id  
 */

// this if he will book for 2 dictors for example 
router.delete("/:id/appointment",verfiy_token_and_authentication,asynchandler(async(req,res)=>{
    let appointment_details=await Appointment.findOne({$and:[{pat_id:req.params.id},{doc_id:req.body.doc_id}]})
    if(appointment_details){
        let appointment_instance = await Appointment.findOneAndDelete({$and:[{pat_id:req.params.id},{doc_id:req.body.doc_id}]})
        const { Day, start, end } = appointment_details.Time;
        const doctorInstance = await Doctor.findOne({  doc_id:req.body.doc_id });
        const doctorTimeSlots = await Time.findOne({
           doc_id:req.body.doc_id
        });
        let matchingSlot = doctorTimeSlots.slots.find(slot =>
            slot.Day === Day &&
            slot.start === start &&
            slot.end === end &&
            slot.Status==="invalid"
        );
        console.log("Matching Slot", matchingSlot);
        if (matchingSlot) {
            
            // Update the time slot status to mark it as valid
            const updatedTimeSlot = await Time.findOneAndUpdate(
                {
                    doc_id:req.body.doc_id,
                    "slots.Day": Day,
                    "slots.start":start,
                    "slots.end": end,
                    "slots.Status": "invalid"
                },
                { $set: { "slots.$.Status": "valid" } },
                { new: true }
            );
            doctorTimeSlots.NumofReservations--
            await doctorTimeSlots.save();
            console.log("appointment_instance",appointment_instance)
            return res.status(201).json({message:"A Appointment is Canceled"});
        }

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
 * @desc  Cancel service
 * @method post
 * @path home/patient/id/services

 */
router.delete("/:id/services",verfiy_token_and_authentication,asynchandler(async(req,res)=>{
    if (!req.body.service)
        {
            res.status(400).json({message:"Name of service is Required"})
 
        }
    const billing_instance = await Billing.findOne({pat_id:req.params.id})
    let services_list = billing_instance.services

    services_list = services_list.filter(service => service.Service != req.body.service)
    console.log("sevices_list",services_list)
    // console.log("sevices_list",services_list.length)

    if(services_list.length < 1)
        {
            const appointment_instance = await Appointment.find({pat_id:req.params.id})
            if (appointment_instance.length < 1)
                {
                    const deletion_service = await Billing.findOneAndDelete({pat_id:req.params.id})
                    res.status(201).json({message:"Service is Canceled",deletion_service})

                }
            else{
                const billing_update = await Billing.findOneAndUpdate({pat_id:req.params.id},{$set:{

                    services:services_list,
                    Total_Amount:0
        
                }},{new:true})

                res.status(201).json({message:"Service is Canceled",billing_update})

            }    

        }
    else{
        let total_amount = 0;
        for(let i=0;i<services_list.length;i++){
            total_amount += services_list[i].fees
            console.log("total_amount",total_amount)

        }
        const billing_update = await Billing.findOneAndUpdate({pat_id:req.params.id},{$set:{

            services:services_list,
            Total_Amount:total_amount

        }},{new:true})

        res.status(201).json({message:"Service is Canceled",billing_update})
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
            console.log("doc_id",appointment_instance[0].doc_id)
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
       let {...data} = req.body
    
        const { error } = validateRegisterAppointment({pat_id:req.params.id,...data});
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Check if appointment already exists for the patient
        const existingAppointment = await Appointment.findOne({$and: [
            {pat_id: req.params.id},
            {doc_id: req.body.doc_id},
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
        const doctorInstance = await Doctor.findById(req.body.doc_id)
        if (!doctorInstance) {
            return res.status(400).json({ message: "Doctor not found." });
        }
        const doctorTimeSlots = await Time.findOne({
            doc_id: req.body.doc_id
        });
        const { Day, start, end } = req.body.Time;
        console.log("doctorTimeSlots",doctorTimeSlots.slots)
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
        console.log("updatedTimeSlot",updatedTimeSlot)

        // Create and save the appointment
        const appointmentInstance = new Appointment({
            fees: req.body.fees,
            doc_id: req.body.doc_id,
            pat_id: req.params.id,
            Time: {
                Day: req.body.Time.Day,
                start: req.body.Time.start,
                end: req.body.Time.end
            }
        });
        const appointmentDetails = await appointmentInstance.save();
        // create billing for this appointment 
        const billing_instance = await Billing.findOne({pat_id:req.body.pat_id}) // make sure for doesnot have billing before
        if(! billing_instance){
    
            const created_billing = new Billing({
                pat_id:req.params.id,
                services:[],
                Total_Amount:0,

            })
            const billing_data = await created_billing.save()
            console.log("billing",billing_data)
        }
        res.status(200).json(appointmentDetails);
    
}));

/**
 * @desc  get available appointments
 * @method get
 * @path home/patient/:id/available_appointments
 */

router.get('/:id/available_appointments', asynchandler(async (req, res) => {
    // Extract query parameters
    const { specialization,day} = req.query;
        const Doctorsinalldep = await Dep.find({}).select('doctor_id DPname _id fees').exec();
        let availableAppointments=[]
        const doctorIds = Doctorsinalldep.map(doc => doc.doctor_id);
    if (!specialization && !day) {

        for (let i = 0; i < doctorIds.toString().split(',').length; i++) {
            const docId = doctorIds.toString().split(',')[i];
            const doctorTimeSlots = await Time.findOne({ doc_id: docId });
            if (doctorTimeSlots) {
                // Filter slots to find available ones
                const availableSlots = doctorTimeSlots.slots.filter(slot =>
                    slot.Status === "valid" 
                );
                const doctor = await Doctor.findById(docId).select('Dname Specialization');
                const departmenFees = await Dep.findOne({ doctor_id: docId }).select('fees -_id fees ').exec();

                // Construct doctor's information with available slots
                const doctorInfo = {
                    Fees:departmenFees,
                    doctorName: doctor ? doctor.Dname : "Unknown",
                    DoctorSpecialization: doctor ? doctor.Specialization : "Unknown",
                    availableSlots: availableSlots
                };

                availableAppointments.push(doctorInfo);
            }}
            console.log("availableAppointments",availableAppointments)

            return res.status(200).json(availableAppointments);
    }
    
    if(specialization && day ){
        const Departments=await Dep.find( {_id: specialization} )
        console.log("appoinitmnet",Departments)
        if (Departments) {
            console.log("sara")
            const doctors=await Dep.find( {_id: specialization} ).select('doctor_id')
            console.log("doctors",doctors)
            const doctorIds = doctors.map(doc => doc.doctor_id);
            let availableAppointments = [];
            for (let i = 0; i < doctorIds.toString().split(',').length; i++) {
                const docId = doctorIds.toString().split(',')[i];
                const doctorTimeSlots = await Time.findOne({ doc_id: docId });
                if (doctorTimeSlots) {
                    // Filter slots to find available ones
                    const availableSlots = doctorTimeSlots.slots.filter(slot =>
                        slot.Status === "valid" && slot.Day === day
                    );
                
                    
                    const doctor = await Doctor.findById(docId).select('Dname Specialization');
                    const departmenFees = await Dep.findOne({ doctor_id: docId }).select('fees -_id fees').exec();
                    
                    // Construct doctor's information with available slots
                    const doctorInfo = {
                        doctorIds: docId,
                        Fees:departmenFees,
                        doctorName: doctor ? doctor.Dname : "Unknown",
                        DoctorSpecialization: doctor ? doctor.Specialization : "Unknown",
                        availableSlots: availableSlots
                    };

                    availableAppointments.push(doctorInfo);
                }
            }
            return res.status(200).json(availableAppointments);

    }
 
}
    if(specialization ){
        const Departments=await Dep.find( {_id: specialization} )
        
        console.log("appoinitmnet",Departments)
        if (Departments) {
            const doctors=await Dep.find( {_id: specialization} ).select('doctor_id')
            const doctorIds = doctors.map(doc => doc.doctor_id);
            let availableAppointments = [];
            for (let i = 0; i < doctorIds.toString().split(',').length; i++) {
                console.log("ranaa")
                const docId = doctorIds.toString().split(',')[i];
                const doctorTimeSlots = await Time.findOne({ doc_id: docId });
                if (doctorTimeSlots) {
                    // Filter slots to find available ones
                    const availableSlots = doctorTimeSlots.slots.filter(slot =>
                        slot.Status === "valid" 
                    );
                
                    const doctor = await Doctor.findById(docId).select('Dname Specialization');
                    const departmenFees = await Dep.findOne({ doctor_id: docId }).select('fees -_id fees').exec();
                    // Construct doctor's information with available slots
                    const doctorInfo = {
                        doctorIds: docId,
                        Fees:departmenFees,
                        doctorName: doctor ? doctor.Dname : "Unknown",
                        DoctorSpecialization: doctor ? doctor.Specialization : "Unknown",
                        availableSlots: availableSlots
                    };

                    availableAppointments.push(doctorInfo);
                }

            }
            console.log("availableAppointments",availableAppointments)

            return res.status(200).json(availableAppointments);
    }

    }
    if (day) {
        const Doctorsinalldep = await Dep.find({}).select('doctor_id DPname _id').exec();
        let availableAppointments=[]
    
        for (let i = 0; i < doctorIds.toString().split(',').length; i++) {
            const docId = doctorIds.toString().split(',')[i];
            const doctorTimeSlots = await Time.findOne({ doc_id: docId, "slots.Day": day });
            if (doctorTimeSlots) {
                // Filter slots to find available ones
                const availableSlots = doctorTimeSlots.slots.filter(slot =>
                    slot.Status === "valid" 
                );
                const doctor = await Doctor.findById(docId).select('Dname Specialization');
                const departmenFees = await Dep.findOne({ doctor_id: docId }).select('fees -_id fees').exec();
                // Construct doctor's information with available slots
                const doctorInfo = {
                    doctorIds: docId,
                    Fees:departmenFees,
                    doctorName: doctor ? doctor.Dname : "Unknown",
                    DoctorSpecialization: doctor ? doctor.Specialization : "Unknown",
                    availableSlots: availableSlots
                };
                availableAppointments.push(doctorInfo);
            }}
            return res.status(200).json(availableAppointments);
    }

}));



module.exports=router