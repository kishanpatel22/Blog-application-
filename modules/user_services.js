var user            = require('./user.js'),
    jwt             = require("jsonwebtoken"),
    bcrypt          = require("bcryptjs")

/* get the enviornement variables */
require('dotenv').config();

class user_services {

    constructor() {}  
    
    /* server side validation of user data */
    validate_user_data(data) {
        const user_name = data.username
        const user_email = data.email
        const user_password = data.password
        var error = null
        
        /* username verification */
        const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/
        if(user_name.length < 6 || format.test(user_name)) {
             error = "Error : Invaild username !"
        } else {
            const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.com)+$/
            /* email verifcation */
            if(!user_email.match(mailformat)) {
                error = "Error : Invaild email address !" 
            } else {
                if(user_password.length < 6) {
                    error = "Error: Invaild password !"
                } 
            }
        }
        return error
    }

    /* registers the user data in the data base */
    async register_user_data(data) {
        
        /* hash the password before entering in database */ 
        const saltRounds = 10
        var new_password = await bcrypt.hash(data.password, saltRounds)

        /* check is the user is not registered already */
        var user_email = data.email 
        var user_data = await user.findOne({email: user_email})
        if(!user_data) {
            data.password = new_password
            var registered_data = await user.create(data)
            return registered_data
        } else {
            /* The user is already registered */
            throw new Error('ERR_NUM 1')
        }
    }
    
    /* genarates a JWT given a payload */
    generate_token(payload) {
        var token = jwt.sign(payload, 
                             process.env.SECRET, 
                             {expiresIn: process.env.TOKEN_TIME})
        return token;
    }
    
    /* login a registered user */
    async authorize_user_data(login_data) {
        /* check in database if the user exists */
        var user_email = login_data.email 
        var user_data = await user.findOne({email: user_email})
        if(user_data) {
            /* check if the user entered correct password and email */
            var password_check = 
                await bcrypt.compare(login_data.password, user_data.password)
            if(password_check) {
                /* generate a JWT token */
                var user_id = user_data._id.toString()
                var payload = {_id: user_id}
                var token = jwt.sign(payload, 
                                     process.env.SECRET, 
                                     {expiresIn: process.env.TOKEN_TIME})

                return {user_data: user_data, token: token};
            } else {
                throw new Error('ERR_NUM 3')
            }
        } else {
            /* The user has not registered */
            throw new Error('ERR_NUM 2')
        }
    }


    /* middleware */ 
    /* authenticates a user trying to access any websitepages */
    authenticate_user_data(req, res, next) {
        const token = req.cookies.access_token

        // if no token then redirect to login 
        if(token) { 
            // verfiy the token and get the user data 
            const user_data = 
                async function verify_token(jwt_token) {
                    try {
                        const payload = await jwt.verify(jwt_token, process.env.SECRET);
                        const user_data = await user.findById(payload._id);
                        return user_data
                    } catch(err) {
                        throw new Error(err);
                    }
                }(token);
            user_data
                .then(user_exists)
                .catch(console.log)
            // check if the user exists in database 
            function user_exists(data) {
                // if data exists then user can access the webpage 
                if(data) {
                    next();         
                } else {
                    // user is not existing 
                    res.clearCookie('access_token')
                    req.flash("error", "Registeration Required")
                    res.redirect('/blogs/register')
                }
            }
        } else {
            req.flash("error", 'Login Required : it seems that you are not logged in');
            res.redirect('/blogs/login');
        }
    }


    /* middleware */
    /* user tries to login again with being logged in */
    check_login(req, res, next) {
        const token = req.cookies.access_token
        if(token) {
            // verfiy the token and get the user data 
            const user_data = 
                async function verify_token(jwt_token) {
                    try {
                        const payload = await jwt.verify(jwt_token, process.env.SECRET);
                        const user_data = await user.findById(payload._id);
                        return user_data
                    } catch(err) {
                        throw new Error(err);
                    }
                }(token);
            user_data
                .then(check_user)
                .catch(console.log)
            function check_user(data) {
                if(data) {
                    req.flash("error", 'Warning : you need to logout inorder to login!')
                    res.redirect('/blogs/show_user_blogs')
                } else {
                    // clear cookie 
                    // since user has a token but token cannot identify the user data
                    res.clearCookie('access_token')
                    req.flash("error", 'Login Required : invaild access_token')
                    res.redirect('/blogs/login')
                }
            }
        } else {
            // we can allow user to login
            next();
        }
    }

    /* gets the userid from the token */
    get_user_id(token) {
        var payload = undefined
        try {
            payload = jwt.verify(token, process.env.SECRET);
        } catch(err) {
            console.log(err)
        }
        return payload
    }
}

module.exports = user_services

