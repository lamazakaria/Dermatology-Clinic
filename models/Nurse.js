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

function validateRegisterNurse(obj){
    const schema = joi.object({
        name: joi.string().trim().min(2).max(100).required(),
        email: joi.string().trim().min(6).max(100).required().email(),
        Salary:joi.number().min(1000).max(25000).required(),
        phone:joi.string().regex(/^[0-9]{11}$/).messages({'string.pattern.base': `Phone number must have 11 digits.`}).required(),
        sex:joi.string().trim().required(),
        address:joi.string().trim().min(4).max(100).required(),
        age:joi.number().min(24).max(80).required(),
        doctor_id:joi.string().trim().required()


    });
    return schema.validate(obj)
}


function validateUpdateNurse(obj){
    const schema = joi.object({
        name: joi.string().trim().min(2).max(100),
        Salary:joi.number().min(1000).max(25000),
        phone:joi.string().regex(/^[0-9]{11}$/).messages({'string.pattern.base': `Phone number must have 11 digits.`}),
        address:joi.string().trim().min(4).max(100),
        age:joi.number().min(24).max(80),
        doctor_id:joi.string().trim(),
        sex:joi.string().trim(),
        email: joi.string().trim().min(6).max(100).email()
    

    });
    return schema.validate(obj)
}
module.exports = {
    Nurse,
    validateUpdateNurse,
    validateRegisterNurse




}

