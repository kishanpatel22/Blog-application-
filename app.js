/* import framworks and libraries for application */
var body_parser         = require('body-parser'),
    express             = require('express'),
    mongoose            = require('mongoose'),
    session             = require('express-session')
    MongoStore          = require('connect-mongo')(session),
    flash               = require('connect-flash')
    cookie_parser       = require('cookie-parser'),
    methodOverride      = require('method-override'),
    blog                = require('./modules/blogs.js'),
    user                = require('./modules/user.js'),
    init_db             = require('./modules/init_db.js'),
    init_trending_blogs = require('./modules/init_trending.js'),
    user_services_class = require('./modules/user_services.js')

/* all the secrets */
require('dotenv').config();

/* make a instance of the class registration */
var user_service = new user_services_class();

/* get your applicaiton */
app = express();

/* MongoDB configuration */
const local_address='mongodb://localhost:27017/blog_app'
const mongolab_address='mongodb+srv://Kishan:Kishan22@@blog-application-4jfbx.mongodb.net/test?retryWrites=true&w=majority' 

mongoose
    .connect(mongolab_address, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log( 'Database Connected!' ))
    .catch(err => console.log( err ));

/* set file extension that server looks for requests and responses */
app.set('view engine', 'ejs');

/* use the public folder for CSS */
app.use(express.static('public'));

/* use the body parser for JSON files */  
app.use(body_parser.urlencoded({extended : true})); 

/* use method overide to deal with routes other than POST and GET*/
app.use(methodOverride("_method"));

/* use the cookie parser */
app.use(cookie_parser());

/* flash */
app.use(flash());

/* session required for flash*/
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection})
}))

/* smart middleware */
app.use(function(req, res, next) {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

/*--------------------- RESTful ROUTES ----------------------*/

app.get('/', function(req, res) {
    res.redirect('/blogs');
});

app.get('/blogs/comming_soon', function(req, res) {
    res.send('We are working to provide you this service in comming future!')
});

// index route 
app.get('/blogs', function(req, res) {
    res.render('index');
});

// signup web page
app.get('/blogs/register', 
        user_service.check_login,
        function(req, res) {
   
    res.render('register');
})

// post request for registraion
app.post('/blogs/register', 
         user_service.check_login,
         function(req, res) {

    const data = {username: req.body.username,
                  email   : req.body.email,
                  password: req.body.password}
    
    // sever side verification 
    const validation_errors = user_service.validate_user_data(data) 
    
    if(validation_errors) {
        req.flash("error", validation_errors)
        res.redirect('/blogs/register')
    } else {
        // registers a new user 
        new_user = user_service.register_user_data(data);
        // check for any error raised 
        new_user
            .then(user_registered)
            .catch(function(err) { res.send(err.message) })
    }
    
    function user_registered(data) {
        if(data) {
            const payload = {_id: data._id}
            const token = user_service.generate_token(payload)
            res.cookie('access_token', token, process.env.COOKIE_OPTIONS);
            req.flash("success", "Hello " + data.username + " ,write your first blog");
            res.redirect('/blogs/show_user_blogs')
        } else {
            res.flash("error", "Registeration failed !")
            res.redirect('/blogs/register')
        }
    }
});

// login webpage 
app.get('/blogs/login', 
    user_service.check_login,
    function(req, res) {

    res.render('login');
});

app.post('/blogs/login',
         user_service.check_login,
         function(req, res) {

    var data = {email   : req.body.email,
                password: req.body.password}
    
    /* authorize an existing user */ 
    JWT = user_service.authorize_user_data(data);
    JWT 
        .then(show_user_blogs)
        .catch(function(err) { res.send(err.message) })
    
    /* shows the blogs for the user with the generated token */
    function show_user_blogs(data) {
        const token = data.token
        res.cookie('access_token', token, process.env.COOKIE_OPTIONS);
        res.redirect('/blogs/show_user_blogs');
    }
})

app.get('/blogs/logout', 
        user_service.authenticate_user_data,
        function(req, res) {

    /* clear the access token cookie */
    res.clearCookie('access_token')
    req.flash("success", "Logged out successfully")
    res.redirect('/blogs/login')
})

// create new blogs for user 
app.get('/blogs/create_blog',
        user_service.authenticate_user_data,
        function(req, res) {

    res.render('create_blog');
});

// show all blogs of user
app.get('/blogs/show_user_blogs', 
        user_service.authenticate_user_data,
        function(req, res){
    
    /* we can get the user id directly since authentication is done */
    var user_id = user_service.get_user_id(req.cookies.access_token);

    /* get the user blogs */
    var user_data = user.findById(user_id).populate("user_blogs")
    user_data
            .then(function(data) {
                    res.render('show_user_blogs', {data: data})
                 })
            .catch(function(err) {console.log(err)}) 
})

// add a new blog
app.post('/blogs/show_user_blogs',
         user_service.authenticate_user_data,
         function(req, res) {

    blog.create(req.body.blog, function(err, newblog) {
        if(err) {
            console.log(err);
        } else {
            var user_id = user_service.get_user_id(req.cookies.access_token);
            user.findById(user_id, function(err, user_data) {
                if(err) {
                    console.log(err)
                } else {
                    user_data.user_blogs.push(newblog._id)
                    user_data.save(function(err) {
                        if(!err) {
                            res.redirect('/blogs/show_user_blogs')
                        }
                    })
                }
            })
        }
    });
});

// edit the contents of blog 
app.get('/blogs/show_user_blogs/:id/edit', 
        user_service.authenticate_user_data,
        function(req, res) {

    blog.findById(req.params.id, function(err, found_blog) {
        if(err) {
            console.log("Error in opening a blog");
        } else {
            res.render('user_edit', {pre_blog : found_blog});
        }
    });
});

// show a single blog of user
app.get('/blogs/show_user_blogs/:id', 
        user_service.authenticate_user_data,
        function(req, res) {

    blog.findById(req.params.id, function(err, found_blog) {
        if(err) {
            console.log("Error in opening a blog");
        } else {
            res.render('show_blog', {blog : found_blog});
        }
    });
});

// upate an existing blog request 
app.put('/blogs/show_user_blogs/:id', 
        user_service.authenticate_user_data,
        function(req, res) {

    /* find the blog and update the blog */
    blog.findByIdAndUpdate(req.params.id, req.body.blog, 
        function(err, updated_blog) {
            if(err) {
                console.log("Cannot edit the blog");
            } else {
                res.redirect('/blogs/show_user_blogs/' + req.params.id);
            }
        });
});

app.delete('/blogs/show_user_blogs/:id', 
           user_service.authenticate_user_data,
           function(req, res) {
    
    /* we can get the user id directly since authentication is done */
    var user_id = user_service.get_user_id(req.cookies.access_token);
    user.findById(user_id, function(err, user_data) {
        if(err) {
            console.log(err)
        } else {
            var user_blog_ids = user_data.user_blogs
            for(var i = 0; i < user_blog_ids.length; i++) {
                if(req.params.id == user_blog_ids[i]) {
                    user_blog_ids.splice(i, 1)
                    break
                }
            }
            user_data.user_blogs = user_blog_ids
            user_data.save(function(err) {
                if(err) {
                    console.log(err);
                }
            })
        }
    });

    blog.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log("Cannot remove the blog");
        } else {
            res.redirect("/blogs/show_user_blogs");
        }
    });
});

// TODO : create a API request for the trending blogs
app.get('/blogs/trending', function(req, res) {
    res.render('trending.ejs', {blogs: init_trending_blogs});
});

/* applicaiton to listen (start) from given port and IP addresses */
app.listen(process.env.PORT, function() {
    console.log("BLOG APPLICATION SERVER has been started at port " + process.env.PORT);
});

