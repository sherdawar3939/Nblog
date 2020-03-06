const mongoose=require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    details:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    },
    profile:{
        type:String,
        required:true
    },
    Date:{
        type:Date,
        default:Date.now
    }
})
  mongoose.model('posts',PostSchema)