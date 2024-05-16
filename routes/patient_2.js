

const { Billing, validateRegisterBilling,validatePatientId} = require("../models/Billing")
const { Doctor} =require("../models/Doctor")
const { Service,validateRegisterService} = require("../models/Service")


/**
 * @desc  book service
 * @method post
 * @path home/patient/id/services
 
 */
router.post("/:id/services",verfiy_token_and_authentication,asynchandler(async(req,res)=>{
    const{error} = validateRegisterService(req.body)
    if(error)
        res.status(400).json({message:error.details[0].message})

    const service_schema  = await Service.find({service:req.body.service})
    const billing_schema = await Billing.findOne({pat_id:req.params.id})
    if(!billing_schema)
        { 
            let body ={
                pat_id:req.params.id,
                services:[
                    {
                        id:(service_schema[0]._id).toString(),
                        Service:service_schema[0].service,
                        fees:service_schema[0].fees
                    }
                ],
                Total_Amount:service_schema[0].fees,
            

            }
            const{error} = validateRegisterBilling(body)
            if(error)
                res.status(400).json({message:error.details[0].message})

            const new_billing = new Billing(body)
            let docs = await new_billing.save()
            res.status(200).json({message:"Service is booked",docs:docs._doc})



        }
    else{
        let total_amount = 0
        let services_array = billing_schema.services
        services_array.push({
            id:service_schema[0]._id,
            Service:service_schema[0].service,
            fees:service_schema[0].fees
        })
       // add new fees
        for(let i=0; i< services_array.length;i++){
            total_amount += services_array[i].fees
            
        }

        const billing_instance = await Billing.findOneAndUpdate({pat_id:req.params.id},{
            $set:{
                services:services_array,
                Total_Amount:total_amount

            }
        },{new:true})

        res.status(200).json({message:"Service is booked",billing_instance})



    }    
   

}))

/**
 * @desc  show biling
 * @method post
 * @path home/patient/id/billing
 
 */
router.get("/:id/billing",verfiy_token_and_authentication,asynchandler(async(req,res)=>{
    const billing_instance = await Billing.find({pat_id:req.params.id})
    let total_amount = 0
    var docs;

    const patient_instance = await Patient.findById(req.params.id,'Pname')
    if(!patient_instance)
        res.status(400).json({message:"Please Enter ID Correctly"})
    
    // get appointments
    const appointment_instance = await Appointment.find({pat_id:req.params.id})
   

    // get fees of services
    total_amount = billing_instance[0].Total_Amount
    let date = billing_instance[0].Date.toLocaleDateString()
    
    console.log(date)      

    // get fees of appointment
    if(appointment_instance.length > 0)
        {  

                    
            // get name of doctor 
            let doc_id = appointment_instance[0].doc_id
            const doctor_instance = await Doctor.findById(doc_id,'Dname')
    
            total_amount += appointment_instance[0].fees
            docs = {
                Date: date,
                pat_id:req.params.id,
                patient_name: patient_instance.Pname,
                doctor_name : doctor_instance.Dname,
                Time:appointment_instance[0].Time,
                appointment_fees:appointment_instance[0].fees,
                services: billing_instance[0].services,
                total_amount : total_amount


            }

        }
    else{
        console.log(patient_instance)
        docs ={  Date: date,
                
                pat_id:req.params.id,
                patient_name: patient_instance.Pname,
                services: billing_instance[0].services,
                total_amount : total_amount

        }

        console.log(docs)
    }    
        

    res.status(200).json(docs)










}))