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
        name: joi.string().trim().min(2).max(100).required(),
        email: joi.string().trim().min(6).max(100).required().email(),
        password:joi.string().trim().min(6).max(100).required(),
        Salary:joi.number().min(1000).max(25000).required(),
        phone:joi.string().regex(/^[0-9]{11}$/).messages({'string.pattern.base': `Phone number must have 11 digits.`}).required(),
        sex:joi.string().trim().required(),
        address:joi.string().trim().min(4).max(100).required(),
        age:joi.number().min(24).max(80).required(),
      

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

