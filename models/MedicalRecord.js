const express = require("express")
const { required, string } = require("joi")
const mongoose = require("mongoose")

const MedicalRecordSchema = new mongoose.Schema({
    pat_id:{
        required : true,
        type: mongoose.Schema.Types.ObjectId ,
        ref:"Patient",
        trim:true
    },
    visitDate: {
        required:true,
        type:Date,
        default: Date.now

    },
    diagnosis:[{
        required:true,
        type:String,
        trim:true

    }],
    prescriptions:[{
        required:true,
        type:{
            dosage:String,
            medication:String,    

        }

    }],
    notes:{
        required:true,
        type:String,
        trim:true

    }



})

function validateRegisterMedicalRecord(obj) {
    const schema = joi.object({
        notes: joi.string().trim().required(),
        pat_id: joi.string().trim().required(),
        diagnosis:joi.array().items(joi.string().trim().required()).required(),
        prescriptions: joi.array().items(joi.object({
            dosage: joi.string().required(),
            medication: joi.string().required()
        })).required()
        
    });
    return schema.validate(obj)
}


const MedicalRecord = mongoose.model("medicalrecord",MedicalRecordSchema)

module.exports ={
    MedicalRecord,
    validateRegisterMedicalRecord

}