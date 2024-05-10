const jwt = require("jsonwebtoken")
const { Admin,validateRegisterAdmin,validateLoginAdmin } =require("../models/Admin")

function verfiy_token(req,res,next){
    const token = req.headers.token
    console.log(token)
    if(token)
        { 
            try {
                const decoded_token = jwt.verify(token,process.env.JWT_SECRET_KEY)
                req.user = decoded_token
                next()

            }
            catch(error)
            {
                res.status(401).json({message:"Token is Invalid"})

            }

        }
    else{
        res.status(401).json({message:"Token is expired , You need to Sign in"})
    }    
   
}


function verfiy_token_and_authentication(req,res,next)
{
    verfiy_token(req,res,()=>{
        if(req.user.id === req.params.id)
            next()
        else{
           return res.status(403).json({message:"You are not Allowed"})

        }
    })
}

function verfiy_isAdmin(req,res,next){
    verfiy_token_and_authentication(req,res,async()=>{
        let admin_instance = await Admin.findOne({_id:req.user.id})

        if(!admin_instance)
            return res.status(403).json({message:"You are not Admin , Admins only have Permission"})
    
        next()

    })
 

    
}


module.exports = {
 verfiy_token,
 verfiy_token_and_authentication,
 verfiy_isAdmin


}