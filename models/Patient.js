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
    Paddress:{
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
        name: joi.string().trim().min(2).max(100).required().messages({
            'string.empty': 'Name is required.',
            'string.min': 'Name must be at least 2 characters long.',
            'string.max': 'Name must be less than or equal to 100 characters long.',
            'any.required': 'Name is required.'
        }),
        email: joi.string().trim().min(6).max(100).required().email().messages({
            'string.empty': 'Email is required.',
            'string.min': 'Email must be at least 6 characters long.',
            'string.max': 'Email must be less than or equal to 100 characters long.',
            'string.email': 'Email must be a valid email address.',
            'any.required': 'Email is required.'
        }),
        password:joi.string().trim().min(6).max(100).required().messages({
            'string.empty': 'Password is required.',
            'string.min': 'Password must be at least 6 characters long.',
            'string.max': 'Password must be less than or equal to 100 characters long.',
            'any.required': 'Password is required.'
        }),
        phone:joi.string().regex(/^[0-9]{11}$/).messages({'string.pattern.base': `Phone number must have 11 digits.`}).required(),
        sex:joi.string().trim().required(),
        address:joi.string().trim().min(4).max(100).required(),
        age:joi.number().min(2).max(80).required(),


    });
    return schema.validate(obj)
}

function validateLoginPatient(obj){
    const schema = joi.object({
        email: joi.string().trim().min(6).max(100).required().email(),
        password:joi.string().trim().min(6).max(100).required(),
        person_type:joi.string().trim().required()


    });
    return schema.validate(obj)
}

function validateUpdatePatient(obj){
    const schema = joi.object({
        name: joi.string().trim().min(2).max(100),
        phone:joi.string().regex(/^[0-9]{11}$/).messages({'string.pattern.base': `Phone number must have 11 digits.`}),
        address:joi.string().trim().min(4).max(100),
        age:joi.number().min(24).max(80),
        email: joi.string().trim().min(6).max(100).email(),
        password:joi.string().trim().min(6).max(100)

    });
    return schema.validate(obj)
}
module.exports = {
    Patient,
    validateRegisterPatient,
    validateLoginPatient,
    validateUpdatePatient



}

