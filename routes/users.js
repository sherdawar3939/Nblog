const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
 const passport = require('passport');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({dest:'uploads'})

// Load User Model
require('../models/User')
const User = mongoose.model('users')

// User Login
router.get('/login',(req,res)=>{
    res.render('users/login')
});

// User register
router.get('/register',(req,res)=>{
    res.render('users/register')
})

// Login form post
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/posts',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next)
});

// Add post  form
router.post('/register',(req,res)=>{
    let errors =[];
    
    if(req.body.password != req.body.password2){
        errors.push({text:'password do not match'});
    }
    if(req.body.password.length < 4){
        errors.push({text:'password must be at least 4 character'});
    }
    if(errors.length > 0){
        res.render('users/register',{
            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2
        });
    } 
       else{
           const newUser = new User({
               name:req.body.name,
               email:req.body.email,
               password:req.body.password,
               
           });

           bcrypt.genSalt(10,(err,salt)=>{
               bcrypt.hash(newUser.password,salt,(err,hash)=>{
                   if(err) throw err;
                   newUser.password= hash;
                   newUser.save()
                   .then(user=>{
                       req.flash('success_msg','Now you Registered and can login ');
                       res.redirect('/users/login')
                   })
                   .catch(err=>{
                       console.log(err);
                       return;
                   })
               })
           })
    }

});

router.get('/logout',(req,res)=>{
    req.logOut();
    req.flash('success_msg','you are logout now');
    res.redirect('/users/login');
})


module.exports = router;