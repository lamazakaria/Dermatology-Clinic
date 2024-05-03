const express = require("express")
const router = express.Router();
const asynchandler = require("express-async-handler")
const { Dep, validateRegisterDepartment} =require("../models/Department")

router.post("/Adddep",asynchandler(async(req,res)=>{
    const { error } = validateRegisterDepartment(req.body)
    if(error){
        res.status(400).json({message:error.details[0].message})
    }

    const dep = new Dep({
        DPname: req.body.DPname,
        Dplocation: req.body.Dplocation,
        doctor_id:[req.body.doctor_id]
        
    })

    const result = await dep.save()
    res.status(200).json(result)

}))



module.exports = router;