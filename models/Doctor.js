const mongoose = require('mongoose')
const joi = require('joi')

const DoctorSchema = new mongoose.Schema({
    Dname:{
        required : true,
        type: String,
        trim: true,
        minlenght:2,
        maxlenght:100
        
    },
    Demail:{
        required : true,
        type: String ,
        trim: true,
        minlenght:6,
        maxlenght:100,
        unique:true
    }, 
    Dpassword:{
        required : true,
        type: String ,
        trim: true,
        minlenght:6,
        maxlenght:100
    },
    DSalary:{
        required : true,
        type: Number ,
        trim: true,
        minlenght:5000,
        maxlenght:200000
    },   
    Dphone:{
        required : true,
        type: String ,
        trim: true,
        minlenght:4,
        maxlenght:100
        
    },
    Dsex:{
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
    Dage:{
        required : true,
        type: Number ,
        minlenght:25,
        maxlenght:90
        
    },  
    Specialization:{
        required : true,
        type: String ,
        minlenght:2,
        maxlenght:50
        
    },   
    dep_id:{
        required : true,
        type: mongoose.Schema.Types.ObjectId ,
        ref:"Department",
        trim: true
        
    }      
               
                


})

const Doctor = mongoose.model("doctor",DoctorSchema)

function validateRegisterUser(obj){
    const schema = joi.object({
        Dname: joi.string().trim().min(2).max(100).required(),
        Demail: joi.string().trim().min(6).max(100).required().email(),
        Dpassword:joi.string().trim().min(6).max(100).required(),
        DSalary:joi.number().min(1000).max(25000).required(),
        Dphone:joi.string().trim().min(4).max(100).required(),
        Dsex:joi.string().trim().required(),
        Daddress:joi.string().trim().min(4).max(100).required(),
        Dage:joi.number().min(24).max(80).required(),
        Specialization:joi.string().min(2).max(50).required(),
        dep_id:joi.string().trim().required()


    });
    return schema.validate(obj)
}

function validateLoginDoctor(obj){
    const schema = joi.object({
        Demail: joi.string().trim().min(6).max(100).required().email(),
        Dpassword:joi.string().trim().min(6).max(100).required(),

    });
    return schema.validate(obj)
}

function validateUpdateDoctor(obj){
    const schema = joi.object({
        Dname: joi.string().trim().min(2).max(100),
        Demail: joi.string().trim().min(6).max(100).email(),
        DSalary:joi.number().min(1000).max(25000),
        Dphone:joi.string().trim().min(4).max(100),
        Daddress:joi.string().trim().min(4).max(100),
        Dage:joi.number().min(24).max(80),
        dep_id:joi.string().trim()

    });
    return schema.validate(obj)
}
module.exports = {
    Doctor,
 validateRegisterUser
//  validateLoginUser,
//  validateUpdateUser


}

