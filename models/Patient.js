const mongoose = require('mongoose')
const joi = require('joi')

const PatientSchema = new mongoose.Schema({
    Pname:{
        required : true,
        type: String,
        trim: true,
        minlenght:2,
        maxlenght:100
        
    },
    Pemail:{
        required : true,
        type: String ,
        trim: true,
        minlenght:6,
        maxlenght:100,
        unique:true
    }, 
    Ppassword:{
        required : true,
        type: String ,
        trim: true,
        minlenght:6,
        maxlenght:100
    },
   
    Pphone:{
        required : true,
        type: String ,
        trim: true,
        minlenght:4,
        maxlenght:100
        
    },
    Psex:{
        required : true,
        type: String ,
        trim: true,
        enum : ['Female','Male']
        
    },  
    Daddress:{
        required : true,
        type: String ,
        trim: true,
        minlenght:4,
        maxlenght:100
        
    },    
    Page:{
        required : true,
        type: Number ,
        trim: true,
        minlenght:2,
        maxlenght:80
        
    }
               
                


})

const Patient = mongoose.model("patient",PatientSchema)

function validateRegisterPatient(obj){
    const schema = joi.object({
        Pname: joi.string().trim().min(2).max(100).required(),
        Pemail: joi.string().trim().min(6).max(100).required().email(),
        Ppassword:joi.string().trim().min(6).max(100).required(),
        Pphone:joi.string().trim().min(4).max(100).required(),
        Psex:joi.string().trim().required(),
        Page:joi.number().min(2).max(80).required(),


    });
    return schema.validate(obj)
}

function validateLoginPatient(obj){
    const schema = joi.object({
        Pemail: joi.string().trim().min(6).max(100).required().email(),
        Ppassword:joi.string().trim().min(6).max(100).required(),

    });
    return schema.validate(obj)
}

function validateUpdatePatient(obj){
    const schema = joi.object({
        Pname: joi.string().trim().min(2).max(100),
        Pemail: joi.string().trim().min(6).max(100).email(),
   
        Pphone:joi.string().trim().min(4).max(100)

    });
    return schema.validate(obj)
}
module.exports = {
    Patient,
    validateRegisterPatient
//  validateLoginUser,
//  validateUpdateUser


}

