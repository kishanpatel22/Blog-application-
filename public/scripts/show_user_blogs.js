function navigation_bar_change() {
    var a = document.getElementsByTagName('a')
    a[4].innerHTML = '<div class=\"ui yellow button\">Log out</div>'
    a[4].href = "/blogs/logout"
    a[1].remove()
    item[1].remove()
}
navigation_bar_change()

/* logout event listner is not working correctly */
var logout = document.getElementsByTagName('a')[4]
logout.addEventListener("mouseover", function() {
    this.innerHTML = '<div class=\"ui red button\">Log out</div>'
})
logout.addEventListener("mouseout", function() {
    this.innerHTML = '<div class=\"ui yellow button\">Log out</div>'
})

var like = document.getElementsByClassName('bl');
var dislike = document.getElementsByClassName('bd');

for(var i = 0; i < like.length; i++) {
    
    /* like class */
    like[i].addEventListener("click", function() {
        if(this.classList.contains('green')) {
            this.classList.replace('green', 'primary');
        } else {
            this.classList.replace('primary', 'green');
        }
    });

    /* delete class */
    dislike[i].addEventListener("click", function() {
        if(this.classList.contains('red')) {
            this.classList.replace('red', 'primary');
        } else {
            this.classList.replace('primary', 'red');
        }
    });
}

image_display();
content_display();

/* display images on the screen */
function image_display() {
    var images = document.getElementsByClassName('blog_image') 
    for(var i = 0; i < images.length; i++) {
        if(i % 2 == 1) {
            images[i].classList.remove('left');
            images[i].classList.add('right');
        }
    }
}

/* display the contents of blogs */
function content_display() {
    var contents = document.getElementsByClassName('discription');
    
    for(var i = 0; i < contents.length; i++) {
        content_text = contents[i].textContent;
        new_text = get_required_text(content_text, i);
        contents[i].textContent = new_text;
    }
    
    function get_required_text(content_text, index) {
        var num_chars = 0;
        if(index % 2 == 0) {
            num_chars = 400;
        } else {
            num_chars = 350;
        }
        new_text = content_text.slice(0, num_chars);
        for(var i = num_chars; i < content_text.length; i++) {
            if(content_text[i] == ' ') {
                new_text += ' ...';
                break;
            } else {
                new_text += content_text[i];
            }
        }
        return new_text;
    }
}

