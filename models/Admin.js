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

const Doctor = mongoose.model("admiin",AdminSchema)

function validateRegisterAdmin(obj){
    const schema = joi.object({
        Aname: joi.string().trim().min(2).max(100).required(),
        Aemail: joi.string().trim().min(6).max(100).required().email(),
        Apassword:joi.string().trim().min(6).max(100).required(),
        ASalary:joi.number().min(1000).max(25000).required(),
        Aphone:joi.string().trim().min(4).max(100).required(),
        Asex:joi.string().trim().required(),
        Aaddress:joi.string().trim().min(4).max(100).required(),
        Aage:joi.number().min(24).max(80).required(),
      

    });
    return schema.validate(obj)
}

function validateLoginAdmin(obj){
    const schema = joi.object({
       
        Aemail: joi.string().trim().min(6).max(100).required().email(),
        Apassword:joi.string().trim().min(6).max(100).required()
    
    });
    return schema.validate(obj)
}


module.exports = {
    Admin,
 validateRegisterAdmin
//  validateLoginUser,
//  validateUpdateUser


}

