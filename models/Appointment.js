const mongoose = require("mongoose")
const joi = require("joi")

const AppointmentSchema = new mongoose.Schema({
   fees:{
        required : true,
        type: Number,
        minlenght:80,
        maxlenght:500
        
    },
    Dname:{
        required : true,
        type: String,
        minlenght:80,
        maxlenght:500
        
    },
    pat_id:{
        required : true,
        type: mongoose.Schema.Types.ObjectId ,
        ref:"Patient",
        trim:true
        
        
    },
    Time:{
        required : true,
        type: {
            Day: String,
            start: String,
            end: String

        }

    },
    specialty: {
         type: String,
        enum : ['Dermatopathology', 'Pediatric Dermatology', 'Mohs Surgery', 'Cosmetic Dermatology'],
        required: true 
            }

  
})

function  validateRegisterAppointment(obj){
    const schema = joi.object({
        fees: joi.number().min(20).max(10000).required(),    
        Dname:joi.string().trim().required(),
        pat_id:joi.string().trim().required(),
        Time: joi.object().min(3).max(100).required(),
        specialty:joi.string().trim().required()

    });
    return schema.validate(obj)
}

function validateUpdateAppointment(obj){
    const schema = joi.object({
        fees: joi.number().min(20).max(10000),
        
        Dname:joi.string().trim(),
        pat_id:joi.string().trim(),
        Time: joi.object().min(3).max(100),
        specialty:joi.string().trim()
        


    });
    return schema.validate(obj)
}




const Appointment = mongoose.model("appoinment",AppointmentSchema)

module.exports ={
    Appointment,
    validateRegisterAppointment,
    validateUpdateAppointment
}