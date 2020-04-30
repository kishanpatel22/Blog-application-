function navigation_bar_change() {
    var a = document.getElementsByTagName('a')
    var item = document.getElementsByClassName('item')
    a[4].innerHTML = '<div class=\"ui yellow button\">Log out</div>'
    a[4].href = "/blogs/logout"
    a[3].remove()
    item[3].remove()
    a[1].remove()
    item[1].remove()
}
navigation_bar_change()
