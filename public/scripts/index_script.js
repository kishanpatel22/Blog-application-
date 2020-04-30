/* Change the background color */
var main_text = document.getElementById('main');
var index_bgcolors = 0;

function change_background() {
    var bgcolors = ['#FF6600', '#D1D100', '#00A271'];
    var bgcolor = bgcolors[index_bgcolors];
    main_text.style.backgroundColor = bgcolor;
    
    index_bgcolors = (index_bgcolors + 1) % (bgcolors.length)
}

setInterval(change_background, 2000);

/* Arrow keys */
var up_arrow = document.getElementsByClassName("arrow alternate circle up icon");
var down_arrow = document.getElementsByClassName("arrow alternate circle down icon");
var t1 = document.getElementById('t1');
var t2 = document.getElementById('t2');

/* on click */
up_arrow[0].addEventListener("click", function() {
    document.getElementsByClassName('ui inverted menu')[0].scrollIntoView({
        behavior: 'smooth'
    })
});

up_arrow[1].addEventListener("click", function() {
    t1.scrollIntoView({
        behavior: 'smooth'
    });    
});

down_arrow[0].addEventListener("click", function() {
    t1.scrollIntoView({
        behavior: 'smooth'
    });    
});

down_arrow[1].addEventListener("click", function() {
    t2.scrollIntoView({
        behavior: 'smooth'
    });    
});

/* up arrow */
for(var i = 0; i < up_arrow.length; i++) {
    up_arrow[i].addEventListener("mouseover",function() {
        this.classList.add('huge');
    });
    up_arrow[i].addEventListener("mouseout",function() {
        this.classList.remove('huge');
    });
}
/* down arrow */
for(var i = 0; i < down_arrow.length; i++) {
    down_arrow[i].addEventListener("mouseover",function() {
        this.classList.add('huge');
    });
    down_arrow[i].addEventListener("mouseout",function() {
        this.classList.remove('huge');
    });
}

