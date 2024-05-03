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
        trim:true
        
        
    },
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

function  validateRegisterTime(obj){
    const schema = joi.object({
        NumofReservations: joi.number().max(500).required(),
        doc_id:joi.string().trim().required(),
        slots: joi.object().required(),
        


    });
    return schema.validate(obj)
}



 


const Time = mongoose.model("times",TimeSchema)

module.exports ={
    Time,
    validateRegisterTime
}