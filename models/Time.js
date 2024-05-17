const mongoose = require("mongoose")
const joi = require("joi")

const TimeSchema = new mongoose.Schema({
    NumofReservations:{
        required : true,
        type: Number,
        maxlenght:500
        
    },
    doc_id:{
        required : true,
        type: mongoose.Schema.Types.ObjectId ,
        ref:"Doctor",
        ref:"Patient",
        trim:true 
    },
    // doc_name:{
    //     required : true,
    //     type:String,
    //     ref:"Doctor",
    //     trim:true 

    // },
    slots:[{
        required : true,
        type: {
            Day: String,
            start: String,
            end: String,
            Status:String

        }
      
    }]
    

  
})

function validateRegisterTime(obj) {
    const schema = joi.object({
        NumofReservations: joi.number().max(500).required(),
        doc_id: joi.string().trim().required(),
        slots: joi.array().items(joi.object({
            Day: joi.string().required(),
            start: joi.string().required(),
            end: joi.string().required(),
            Status: joi.string().required().trim()
        })).required()
        
    });
    return schema.validate(obj)
}



 


const Time = mongoose.model("times",TimeSchema)

module.exports ={
    Time,
    validateRegisterTime
}