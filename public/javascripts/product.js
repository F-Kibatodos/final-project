window.onload = function() {
  var star = document.getElementById('star')
  var star_li = star.getElementsByTagName('li')
  var star_word = document.getElementById('star_word')
  var result = document.getElementById('result')
  var i = 0
  var j = 0
  var len = star_li.length
  var word = ['很差', '差', '一般', '好', '很好']

  for (i = 0; i < len; i++) {
    star_li[i].index = i

    star_li[i].onclick = function() {
      for (i = 0; i <= 4; i++) {
        if (i <= this.index) star_li[i].className = 'act'
        else star_li[i].classList.remove('act')
      }
    }
  }
}
