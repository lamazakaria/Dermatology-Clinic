const mongoose = require("mongoose")
const joi = require("joi")

const DepSchema = new mongoose.Schema({
    DPname:{
        required : true,
        type: String,
        trim: true,
        unique: true,
        minlenght:2,
        maxlenght:100
        
    },
    Dplocation:{
        required : true,
        type: Object,
        minlenght:1,
        maxlenght:100
        
    },
    doctor_id:[{
        required : true,
        type: mongoose.Schema.Types.ObjectId ,
        ref:"Doctor",
        trim: true,

        
    }],
})

function validateRegisterDepartment(obj){
    const schema = joi.object({
        DPname: joi.string().trim().min(2).max(100).required(),
        Dplocation: joi.object().min(1).max(100).required(),
        doctor_id:joi.string().trim().required(),
        


    });
    return schema.validate(obj)
}

function validateUpdateDepartment(obj){
    const schema = joi.object({
        Dplocation: joi.object().min(1).max(100),
        doctor_id:joi.string().trim(),
        


    });
    return schema.validate(obj)
}
const Dep = mongoose.model("department",DepSchema)

module.exports ={
    Dep,
    validateRegisterDepartment
}