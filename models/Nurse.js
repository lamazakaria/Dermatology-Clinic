const mongoose = require('mongoose')
const joi = require('joi')

const NurseSchema = new mongoose.Schema({
    Nname:{
        required : true,
        type: String,
        trim: true,
        minlenght:2,
        maxlenght:100
        
    },
    Nemail:{
        required : true,
        type: String ,
        trim: true,
        minlenght:6,
        maxlenght:100,
        unique:true
    }, 
    NSalary:{
        required : true,
        type: Number ,
        trim: true,
        minlenght:4,
        maxlenght:10
    },   
    Nphone:{
        required : true,
        type: String ,
        trim: true,
        minlenght:4,
        maxlenght:100
        
    },
    Nsex:{
        required : true,
        type: String ,
        trim: true,
        enum : ['Female','Male']
        
    },  
    Naddress:{
        required : true,
        type: String ,
        trim: true,
        minlenght:4,
        maxlenght:100
        
    },    
    Nage:{
        required : true,
        type: Number ,
        trim: true,
        minlenght:2,
        maxlenght:3
        
    },  
    
    doctor_id:{
        required : true,
        type: mongoose.Schema.Types.ObjectId ,
        ref:"Doctor",
        trim: true
        
    }      
               
                


})

const Nurse = mongoose.model("nurse",NurseSchema)

function validateRegisterUser(obj){
    const schema = joi.object({
        Nname: joi.string().trim().min(2).max(100).required(),
        Nemail: joi.string().trim().min(6).max(100).required().email(),
        NSalary:joi.number().min(1000).max(25000).required(),
        Nphone:joi.string().trim().min(4).max(100).required(),
        Nsex:joi.string().trim().required(),
        Naddress:joi.string().trim().min(4).max(100).required(),
        Nage:joi.number().min(24).max(80).required(),
        doctor_id:joi.string().trim().required()


    });
    return schema.validate(obj)
}


function validateUpdateNurse(obj){
    const schema = joi.object({
        Nname: joi.string().trim().min(2).max(100),
        Nemail: joi.string().trim().min(6).max(100).email(),
        NSalary:joi.number().min(1000).max(25000),
        Nphone:joi.string().trim().min(4).max(100),
        Naddress:joi.string().trim().min(4).max(100),
        Nage:joi.number().min(24).max(80),
        doctor_id:joi.string().trim()

    });
    return schema.validate(obj)
}
module.exports = {
    Nurse,
    validateRegisterUsr



}

