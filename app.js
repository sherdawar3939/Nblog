const express = require('express');
const hbsbps=require('express-handlebars');
const methodOverride=require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser=require('body-parser');
const passport = require('passport');
const bcryptjs = require('bcryptjs');
const mongoose= require('mongoose');
const {ensureAuthenticated}=require('./helper/auth');

const app = express();

// Load routes
const posts = require('./routes/posts');
const users = require('./routes/users')

// load config passport
 require('./config/passport')(passport);



// connect to Mongoose
mongoose.connect('mongodb://localhost/Nblog',{useNewUrlParser: true,useUnifiedTopology: true})
.then(console.log('Mongodb connected')).catch(err=>{
    console.log(err);
})

// express middleware
app.engine('handlebars',hbsbps({defaultLayout:'main'}));
app.set('view engine','handlebars');

// Middleware bodyParser
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// method override middleware
app.use(methodOverride('_method'));

// express session middleware
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

// passport Middle ware
app.use(passport.initialize());
app.use(passport.session());

// Set up connect flash
app.use(flash());

// Using Global Variables
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg'); 
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null
    next();
})

// Load mongoose model
const Post = mongoose.model('posts');

// home page
app.get('/',(req,res)=>{
    Post.find({})
    .then(posts=>{
     res.render('posts/index',{
         posts:posts
     })
    })
 });

// Use Routes
app.use('/posts', posts);
app.use('/users',users);



const port=5000;
app.listen(port,()=>{
    console.log(`server is listening on ${port}`);
})
