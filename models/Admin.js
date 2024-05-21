const mongoose = require('mongoose')
const joi = require('joi')

const AdminSchema = new mongoose.Schema({
    Aname:{
        required : true,
        type: String,
        trim: true,
        minlenght:2,
        maxlenght:100
        
    },
    Aemail:{
        required : true,
        type: String ,
        trim: true,
        minlenght:6,
        maxlenght:100,
        unique:true
    }, 
    Apassword:{
        required : true,
        type: String ,
        trim: true,
        minlenght:6,
        maxlenght:100
    },
    ASalary:{
        required : true,
        type: Number ,
        trim: true,
        minlenght:4,
        maxlenght:10
    },   
    Aphone:{
        required : true,
        type: String ,
        trim: true,
        minlenght:4,
        maxlenght:100
        
    },
    Asex:{
        required : true,
        type: String ,
        trim: true,
        enum : ['Female','Male']
        
    },  
    Aaddress:{
        required : true,
        type: String ,
        trim: true,
        minlenght:4,
        maxlenght:100
        
    },    
    Aage:{
        required : true,
        type: Number ,
        trim: true,
        minlenght:2,
        maxlenght:3
        
    }
                


})

const Admin = mongoose.model("admin",AdminSchema)

function validateRegisterAdmin(obj){
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
        Salary:joi.number().min(1000).max(25000).required().messages({
            'number.min': 'Salary must be at least 1000.',
            'number.max': 'Salary must be less than or equal to 25000.',
            'any.required': 'Salary is required.'
        }),
        phone:joi.string().regex(/^[0-9]{11}$/).messages({'string.pattern.base': `Phone number must have 11 digits.`}).required(),
        sex:joi.string().trim().required(),
        address:joi.string().trim().min(4).max(100).required().messages({
            'string.empty': 'Address is required.',
            'string.min': 'Address must be at least 4 characters long.',
            'string.max': 'Address must be less than or equal to 100 characters long.',
            'any.required': 'Address is required.'
        }),
        age:joi.number().min(24).max(80).required().messages({
            'number.min': 'Age must be at least 24.',
            'number.max': 'Age must be less than or equal to 80.',
            'any.required': 'Age is required.'
        }),
      

    });
    return schema.validate(obj)
}

function validateLoginAdmin(obj){
    const schema = joi.object({
       
        email: joi.string().trim().min(6).max(100).required().email(),
        password:joi.string().trim().min(6).max(100).required(),
        person_type:joi.string().trim().required()

    
    });
    return schema.validate(obj)
}


module.exports = {
    Admin,
 validateRegisterAdmin,
 validateLoginAdmin


}

