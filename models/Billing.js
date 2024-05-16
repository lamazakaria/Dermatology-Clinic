const mongoose = require("mongoose")
const joi = require("joi")
const BillingSchema = new mongoose.Schema({
    Date: {
        type: Date,
        default: Date.now
    },
    pat_id:{
        required : true,
        type: mongoose.Schema.Types.ObjectId ,
        ref:"Patient",
        trim:true
        

    },
    services:[
       { required : true,
        type:{
            id:mongoose.Schema.Types.ObjectId ,
            Service:String,
            fees:Number
            

        },
        ref:"Service"
    }
    ],
    Total_Amount:{
        type:Number,
        required:true

    },
    Payment_Method:
    {
        type: String ,
        trim: true,
        enum:["Cash","Credit Card"],
        
    }

})

function validateRegisterBilling(obj){
    schema = joi.object({
        pat_id:joi.string().trim().required(),
        services:joi.array().items(
            joi.object().keys({
                id:joi.string().trim().required() ,
                Service:joi.string().trim().required(),
                fees:joi.number().required()


            })
        ),
        Total_Amount:joi.number().required(),
        Payment_Method:joi.string().valid("Cash","Credit Card")

    })

   return  schema.validate(obj)
}

function validateUpdateBilling(obj){
    schema = joi.object({
        Payment_Method:joi.string().valid("Cash","Credit Card").required()



    })

   return  schema.validate(obj)
}


function validatePatientId(obj){
    schema = joi.object({
        pat_id:joi.string().trim().required()



    })

   return  schema.validate(obj)
}


const Billing = mongoose.model("billing",BillingSchema)

module.exports = {
    Billing,
    validateRegisterBilling,
    validateUpdateBilling,
    validatePatientId
} 