var mongoose = require("mongoose");

/* create a new blog schema */
var blog_Schema = new mongoose.Schema({
    title   : String,
    image   : String,
    content : String, 
    created : { type: Date, default: Date.now} 
});
/* return a model of data */
module.exports = mongoose.model('blog', blog_Schema)
