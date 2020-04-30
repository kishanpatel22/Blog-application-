var mongoose = require("mongoose");


/* create a new blog schema */
var user_Schema = new mongoose.Schema({
    username    : String,
    email       : String,
    password    : String,
    user_blogs  : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'blog'
        }
    ],
    created : { type: Date, default: Date.now} 
});

/* return a model of data */
module.exports = mongoose.model('user', user_Schema)
