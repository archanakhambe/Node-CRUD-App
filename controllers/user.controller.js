const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

module.exports.register = (req,res,next) =>{
    console.log('Inside register function');
    var user = new User();  
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.profileimage = req.body.profileimage;
    // user.profileimage = req.file.filename;
    console.log('Inside save function fullname...'+ user.profileimage);
    if(user.fullName == "" || user.fullName ==undefined){
        return res.status(500).send({success:false, message : "Name should not be null"});
     }
    validate(user);
    user.save((err, doc) => {
     //   console.log('Inside save function'+ doc);
        if(!err){
            console.log('registered');
            res.status(200).send({success:true, message : "User Resistered sucessfully."});
        }else {
            console.log('Error occured:  '+ err);
            res.status(500).send({success:false, message : err});
        }
    });
  
};

function validate(user){
    if(user.fullName == "" || user.fullName ==undefined){
       return res.status(500).send({success:false, message : "Name should not be null"});
    }
}
//http://localhost:3000/api/profileById?id=10
module.exports.profileById = (':id',(req,res) =>{
    console.log("Profile b0y id..");
    var id = req.query.id;
    console.log("Profile by id.." + id);
    User.findById(id,(err,docs) =>{
        if(!err){
            console.log("Profile by id.." + docs);
           var token = req.headers['x-access-token'];
           if (!token) res.status(401).send({ auth: false, message: 'No token provided.' });
 
           jwt.verify(token, config.secret, function(err, decoded) {
           if (err) {
               res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            }else{
                res.status(200).send(docs);
            }
           });
        }else{
           console.log("Error in retriving employees : " + JSON.stringify(err,undefined,2));
           }
    });
});

module.exports.profileupdate = (':id',(req,res,next) =>{
    console.log('Inside update function');
   // var user = new User();
    var id = req.query.id;
    console.log("Profile by id.." + id);
    var user ={
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        profileimage: req.body.profileimage
    }
    User.findByIdAndUpdate(id,{ $set: user },{new: true},(err,docs) =>{
        if(!err){
            console.log("Profile updated to .." + docs);
           var token = req.headers['x-access-token'];
            if (!token) {
                 res.status(401).send({ auth: false, message: 'No token provided.' });
            }
  
            jwt.verify(token, config.secret, function(err, decoded) {
                if (err){
                     return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
                }else{
                res.status(200).send(docs);
                 }
            });
           // res.status(200).send(docs);
            console.log('Inside update function fullname...'+ user.email);
        }else{
            console.log("Error in retriving profile : " + JSON.stringify(err,undefined,2));
            }
    });
   
});

//http://localhost:3000/api/profileById?id=10
module.exports.deleteprofile = (':id',(req,res) =>{
    console.log("Profile deleteprofile..");
    var id = req.query.id;
    console.log("Profile deleteprofile id.." + id);
    User.findByIdAndDelete(id,(err,docs) =>{
        if(!err){
            console.log("Profile deleteprofile.." + docs);
            var token = req.headers['x-access-token'];
            res.status(200).send(docs);
            if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

            jwt.verify(token, config.secret, function(err, decoded) {
            if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

                 res.status(200).send(docs);
            });
        }else{
            console.log("Error in deleteprofile : " + JSON.stringify(err,undefined,2));
            }
    });
});

module.exports.login = (req,res) =>{
    console.log('Inside login function');
    var username = req.body.email;
    console.log('Inside login function fullname...');
    var query = {email : username};
     const user = User.findOne({ username });
   var authuser = User.findOne(query,(err, doc) => {
     //   console.log('Inside save function'+ doc);
        if(!err && doc!=null){
            
            console.log('user found..'+doc);
            bcrypt.compare(req.body.password, doc.password, (err, result) => {
                if(!err){
                    console.log("Authentication Done"+result);
                    var token = jwt.sign({ id: user._id }, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                      });
                    res.send({auth: true, token: token, message:"Profile registered successfully.",doc});
                  //  res.send(doc);
                }else{
                    console.log("Authentication fail");
                    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
                }
            });
        }else {
            console.log('User Not Found');
            return res.status(500).send({ auth: false, message: 'User not found.'});
        }
    });

};

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
    // create reusable transporter object using the default SMTP transport
    module.exports.sendemail = (':email',(req,res) =>{
        console.log("send email function.....");
    let transporter = nodemailer.createTransport({
        host:'smtp.ethereal.email',//'smtp.gmail.com',//'mail01.harbingergroup.com',//'smtp.ethereal.email',
        port: '587',//25,//587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'xpyqh3d7ly2dqwwt@ethereal.email',//'xpyqh3d7ly2dqwwt@ethereal.email', // generated ethereal user
            pass: 'tqhhGcKgNd2sszHAq7',//'tqhhGcKgNd2sszHAq7' // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'xpyqh3d7ly2dqwwt@ethereal.email', // sender address
        to: req.query.email, // list of receivers
        subject: 'Registration', // Subject line
        text: 'Registered Successfully', // plain text body
        html: '<b>Registered Successfully</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }else{
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.status(200);
        }
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });

    })