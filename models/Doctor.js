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

function validateRegisterDoctor(obj){
    const schema = joi.object({
        name: joi.string().trim().min(2).max(100).required(),
        email: joi.string().trim().min(6).max(100).required().email(),
        password:joi.string().trim().min(6).max(100).required(),
        Salary:joi.number().min(1000).max(25000).required(),
        phone:joi.string().regex(/^[0-9]{11}$/).messages({'string.pattern.base': `Phone number must have 11 digits.`}).required(),
        sex:joi.string().trim().required(),
        address:joi.string().trim().min(4).max(100).required(),
        age:joi.number().min(24).max(80).required(),
        Specialization:joi.string().min(2).max(50).required(),
        dep_id:joi.string().trim().required()


    });
    return schema.validate(obj)
}

function validateLoginDoctor(obj){
    const schema = joi.object({
        email: joi.string().trim().min(6).max(100).required().email(),
        password:joi.string().trim().min(6).max(100).required(),
        person_type:joi.string().trim().required()

    });
    return schema.validate(obj)
}

function validateUpdateDoctor(obj){
    const schema = joi.object({
        name: joi.string().trim().min(2).max(100),
        Salary:joi.number().min(1000).max(25000),
        phone:joi.string().regex(/^[0-9]{11}$/).messages({'string.pattern.base': `Phone number must have 11 digits.`}),
        email: joi.string().trim().min(6).max(100).email(),
        password:joi.string().trim().min(6).max(100),
        address:joi.string().trim().min(4).max(100),
        age:joi.number().min(24).max(80),
        dep_id:joi.string().trim(),
        Specialization:joi.string().min(2).max(50),
        sex:joi.string().trim()

    });
    return schema.validate(obj)
}
module.exports = {
    Doctor,
 validateRegisterDoctor,
  validateLoginDoctor,
  validateUpdateDoctor


}

