const mongoose = require("mongoose")
const joi = require("joi")

const DeviceSchema = new mongoose.Schema({
    Code:{
        required : true,
        type: String,
        trim: true,
        unique: true,
        minlenght:2,
        maxlenght:100
        
    },
    PPM:{
        required : true,
        type: Number,
        minlenght:1,
        maxlenght:500
        
    },
    Manufacturer:{
        required : true,
        type: String,
        trim: true,
        minlenght:2,
        maxlenght:100

    },

    dep_id:{
        required : true,
        type: mongoose.Schema.Types.ObjectId ,
        ref:"Department",
        trim: true
        
    }      
})

function validateRegisterDevice(obj){
    const schema = joi.object({
        Code:joi.string().min(2).max(100).required(),
        PPM: joi.number().min(1).max(500).required(),
        Manufacturer: joi.string().min(2).max(100).required(),
        dep_id:joi.string().trim().required(),
        


    });
    return schema.validate(obj)
}

function validateUpdateDevice(obj){
    const schema = joi.object({
        PPM: joi.number().min(1).max(500),
        Manufacturer: joi.string().min(2).max(100),
        dep_id:joi.string().trim(),
        


    });
    return schema.validate(obj)
}




const Device = mongoose.model("device",DeviceSchema)

module.exports ={
    Device,
    validateRegisterDevice,
    validateUpdateDevice
}