const mongoose = require("mongoose")
const joi = require("joi")

const ServicesSchema = new mongoose.Schema({
    Service:{
        type:String,
        required:true,
        trim:true
    },
    fees:{
        type:Number,
        required:true
    }

})

function validateRegisterService(obj){
    const schema = joi.object({
        Service: joi.string().trim().required(),
        fees: joi.number().required(),
       


    });
    return schema.validate(obj)
}

const Service = mongoose.model("service",ServicesSchema)

module.exports ={
    Service,
    validateRegisterService
}