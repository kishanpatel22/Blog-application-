function user_page() {
    var a = document.getElementsByTagName('a')
    var item = document.getElementsByClassName('item')
    a[3].remove()
    item[3].remove()
}
user_page()

/* client side verfication of the user data */

var inputs = document.getElementsByTagName('input');
var username = inputs[0]
var email    = inputs[1] 
var password = inputs[2]
/* flags for checking if the user is entering correct input */
var username_flag = false;
var email_flag = false;
var password_flag = false;

username.addEventListener("change", function() {
    // need the user to enter username with atleast 6 characters 
    var text_username = document.getElementById('username');
    var format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
    if(username.value.length >= 6 && !format.test(username.value)) {
        text_username.textContent = ""
        username_flag = true;
        if(username_flag && email_flag && password_flag) {
            change_button_positive();
        }
    } else {
        text_username.textContent = 
            "Username must have atleast 6 characters without any special symbols"
        text_username.style.color = "red"
        username_flag = false;
        change_button_negative();
    }
})

email.addEventListener("change", function() {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.com)+$/
    var text_email = document.getElementById('email');
    if(email.value.match(mailformat)) {
        text_email.textContent = ""
        email_flag = true;
        if(username_flag && email_flag && password_flag) {
            change_button_positive();
        }
    } else {
        text_email.textContent = "Invaild email address"
        text_email.style.color = "red"
        email_flag = false;
        change_button_negative();
    }
})

password.addEventListener("change", function() {
    // need the user to enter username with atleast 6 characters 
    var text_password = document.getElementById('password')
    if(password.value.length > 6) {
        text_password.textContent = ""
        password_flag = true;
        if(username_flag && email_flag && password_flag) {
            change_button_positive();
        }
    } else {
        text_password.textContent = "Password must have atleast 6 characters"
        text_password.style.color = "red"
        password_flag = false
        change_button_negative()
    }
})

function change_button_negative() {
    var button = document.getElementsByTagName('button')[0];
    button.classList.remove('green')
    button.classList.add('red')
}

function change_button_positive() {
    var button = document.getElementsByTagName('button')[0];
    button.classList.remove('red')
    button.classList.add('green')
}
