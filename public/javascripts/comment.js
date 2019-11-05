var star = document.getElementById('star')
var star_li = star.getElementsByTagName('li')
var len = star_li.length
for (i = 0; i < len; i++) {
  star_li[i].index = i

  star_li[i].onclick = function () {
    for (i = 0; i <= 4; i++) {
      if (i <= this.index) star_li[i].className = 'act'
      else star_li[i].classList.remove('act')
    }
  }
}