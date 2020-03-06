const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated}=require('../helper/auth');
const multer  =require('multer');
const storage = multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,('./uploads'));
    },
    filename:function(req,file,cb){
        cb(null,new Date().toISOString() + file.originalname);
    }
})
const upload = multer({storage:storage})




// Load mongoose model
require('../models/Post');
const Post = mongoose.model('posts');


// get post index page
router.get('/',ensureAuthenticated,(req,res)=>{
   Post.find({user:req.user.id})
   .sort({Date:'desc'})
   .then(posts=>{
    res.render('posts/index',{
        posts:posts
    })
   })
});

// Add post form
router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render('posts/add');
});

// Edit post form
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
      Post.findOne({
          _id:req.params.id
      })
      .then(post=>{
          if(post.user!= req.user.id){
              req.flash('error_msg','Not Authorized');
              res.redirect('/posts');
          }else{
            res.render('posts/edit',{
                post:post
            })
          }
      })
});

// Add process form
router.post('/',upload.single('profile'),(req,res)=>{
    console.log(req.file);
  let errors=[];
  if(!req.body.title){
      errors.push({text:'please add the title'});
  }
  if(!req.body.subject){
    errors.push({text:'please add the subject'});
}
if(!req.body.details){
    errors.push({text:'please add some details'});
}

if(errors.length>0){
    res.render('/add',{
        errors:errors,
        title:req.body.title,
        subject:req.body.subject,
        details:req.body.details,
     
    });
}else{
    const newUser={
        title:req.body.title,
        subject:req.body.subject,
        details:req.body.details,
        user:req.user.id,
        profile:req.body.profile  
    }
    new Post(newUser)
    .save()
    .then(post=>{
        req.flash('success_msg','Post is added')
        res.redirect('/posts');
    })
}
});

// Update Form process
router.put('/:id', ensureAuthenticated,(req, res) => {
    Post.findOne({
      _id: req.params.id
    })
    .then(post => {
      // new values
      post.title = req.body.title;
      post.subject=req.body.subject;
      post.details=req.body.details;
  
      post.save()
        .then(post => {
            req.flash('success_msg','Post is Updated')
          res.redirect('/posts');
        })
    });
  });

  // Delete post form
  router.delete('/:id',ensureAuthenticated,(req,res)=>{
      Post.remove({
          _id:req.params.id
      })
       .then(()=>{
           req.flash('success_msg','Post is deleted')
           res.redirect('/posts')
       });
  });


module.exports = router;