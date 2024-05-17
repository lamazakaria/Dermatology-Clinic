const asynchandler = require("express-async-handler");
const {Patient} = require("../models/Patient")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

/**
 * @desc    Get Forgot Password View
 * @route   /password/forgot-password
 * @method  GET 
 * @access  public
 */
module.exports.getForgotPasswordView = asynchandler ((req,res) => {
    res.render('forgot-password');
});

/**
 * @desc    Send Forgot Password Link
 * @route   /password/forgot-password
 * @method  POST 
 * @access  public
 */
module.exports.sendForgotPasswordLink = asynchandler ( async (req,res) => {
    // console.log(req.body.email);
    const user = await Patient.findOne({Pemail: req.body.email});
    if (!user) {
        return res.status(404).json({message: 'User not Found'});
    }

    // New Secert
    const secret = process.env.JWT_SECRET_KEY + user.Ppassword;
    const token = jwt.sign({ email:user.Pemail, id: user._id}, secret,{
        expiresIn:"10m"});

    // Link
    const link = `http://localhost:8000/password/reset-password/${user._id}/${token}`;

    // res.json({message: 'Click on the link', resetPasswordLink: link});
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS
        }
    });

    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: user.Pemail,
        subject: "Reset Password",
        html: `<div>
                <h4>Click on the link below to reset your password</h4>
                <p>${link}</p>
            </div>`
    }

    transporter.sendMail(mailOptions, function(error, success){
        if(error){
            console.log(error);
        } else {
            console.log("Email sent: " + success.response);
        }
    });

    res.render("link-send");
});

/**
 * @desc    Get Reset Password View
 * @route   /password/reset-password/:userId/:token
 * @method  GET 
 * @access  public
 */
module.exports.getResetPasswordView = asynchandler ( async (req,res) => {
    // console.log(req.body.email);
    const user = await Patient.findById(req.params.userId);
    if (!user) {
        return res.status(404).json({message: 'User not Found'});
    }

    // New Secert
    const secret = process.env.JWT_SECRET_KEY + user.Ppassword;
    try {
        jwt.verify(req.params.token, secret);
        res.render('reset-password', {email: user.Pemail})
    } catch (error) {
        console.log(error);
        res.json({message: "Error"});
    }

});

/**
 * @desc    Reset The Password 
 * @route   /password/reset-password/:userId/:token
 * @method  POST 
 * @access  public
 */
module.exports.resetThePassword = asynchandler ( async (req,res) => {
    // console.log(req.body.email);
    const user = await Patient.findById(req.params.userId);
    if (!user) {
        return res.status(404).json({message: 'User not Found'});
    }

    // New Secert
    const secret = process.env.JWT_SECRET_KEY + user.Ppassword;
    try {
        jwt.verify(req.params.token, secret);
        const salt =  await  bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);

        user.Ppassword = req.body.password;

        await user.save();
        res.render('success-password');
    } catch (error) {
        console.log(error);
        res.json({message: "Error"});
    }

});