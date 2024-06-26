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
        pat_id:joi.string().trim().required(),
        Time:  joi.object().keys({
            Day:joi.string().trim().required() ,
            start:joi.string().trim().required(),
            end:joi.string().trim().required()


        }),
        doc_id:joi.string().trim().required()

    });
    return schema.validate(obj)
}

function validateUpdateAppointment(obj){
    const schema = joi.object({
        fees: joi.number().min(20).max(10000),
        pat_id:joi.string().trim(),
        Time: oi.object().keys({
            Day:joi.string().trim() ,
            start:joi.string().trim(),
            end:joi.string().trim()


        }),
        doc_id:joi.string().trim()
 
    });
    return schema.validate(obj)
}




const Appointment = mongoose.model("appoinment",AppointmentSchema)

module.exports ={
    Appointment,
    validateRegisterAppointment,
    validateUpdateAppointment
}