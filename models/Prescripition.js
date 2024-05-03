const mongoose = require('mongoose')
const joi = require('joi')

const PrescripitionSchema = new mongoose.Schema({
    Dosage:{
        required : true,
        type: String,
        trim: true,
        minlenght:2,
        maxlenght:100
        
    },
    Nameofmedicine:{
        required : true,
        type: String ,
        trim: true,
        minlenght:6,
        maxlenght:1000,

    }, 
    contraindictions:{
        required : true,
        type: String ,
        trim: true,
        minlenght:6,
        maxlenght:1000
    },
    Disease:{
        required : true,
        type: String ,
        trim: true,
        minlenght:4,
        maxlenght:1000
    },   
    doc_id:{
        required : true,
        type: mongoose.Schema.Types.ObjectId ,
        ref:"Doctor",
        trim:true
        
        
    },
    pat_id:{
        required : true,
        type: mongoose.Schema.Types.ObjectId ,
        ref:"Patient",
        trim:true
        
        
    }
    
 
                


})

const Prescripition = mongoose.model("prescripition",PrescripitionSchema)

function validatePrescripition(obj){
    const schema = joi.object({
        Dosage: joi.string().trim().min(2).max(100).required(),
        Nameofmedicine: joi.string().trim().min(6).max(1000).required(),
        contraindictions:joi.string().trim().min(6).max(1000).required(),
        Disease:joi.string().min(4).max(1000).required(),
        doc_id:joi.string().trim().required(),
        pat_id:joi.string().trim().required()


    });
    return schema.validate(obj)
}


function validateUpdatePrescripition(obj){
    const schema = joi.object({
        Dosage: joi.string().trim().min(2).max(100),
        Nameofmedicine: joi.string().trim().min(6).max(1000),
        contraindictions:joi.string().trim().min(6).max(1000),
        Disease:joi.number().min(4).max(1000),
        doc_id:joi.string().trim(),
        pat_id:joi.string().trim()

    });
    return schema.validate(obj)
}
module.exports = {
    Prescripition,
    validatePrescripition
//  validateLoginUser,
//  validateUpdateUser


}

