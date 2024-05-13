const mongoose = require("mongoose")
const joi = require("joi")

const AppointmentSchema = new mongoose.Schema({
   fees:{
        required : true,
        type: Number,
        minlenght:80,
        maxlenght:500
        
    },
    doc_id:{
        required : true,
        type: mongoose.Schema.Types.ObjectId ,
        ref:"Doctor",
        trim:true
        
        
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

    }

  
})

function  validateRegisterAppointment(obj){
    const schema = joi.object({
        fees: joi.number().min(20).max(10000).required(),    
        doc_id:joi.string().trim().required(),
        pat_id:joi.string().trim().required(),
        Time: joi.object().min(3).max(100).required()


    });
    return schema.validate(obj)
}

function validateUpdateAppointment(obj){
    const schema = joi.object({
        fees: joi.number().min(20).max(10000),
        
        doc_id:joi.string().trim(),
        pat_id:joi.string().trim(),
        Time: joi.object().min(3).max(100),
        


    });
    return schema.validate(obj)
}




const Appointment = mongoose.model("appointment",AppointmentSchema)

module.exports ={
    Appointment,
    validateRegisterAppointment,
    validateUpdateAppointment
}