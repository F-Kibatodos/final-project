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
const buy = document.querySelector('.buy')
const toCart = document.querySelector('.to-cart')
const buyNow = document.querySelector('.buy-now')

buy.addEventListener('mouseover', function(e) {
  if (e.target === toCart) buy.setAttribute('action', '/cart')
  if (e.target === buyNow) buy.setAttribute('action', '/buynow')
})

const customComments = document.getElementsByClassName('custom-comment')
const editComments = document.getElementsByClassName('edit-comment')
const commentWrappers = document.getElementsByClassName('comment-wrapper')

for (let editComment of editComments) {
  editComment.addEventListener('click', e => {
    editComment.previousElementSibling.previousElementSibling.innerHTML = `<input name="content" class="content form-control" type="text" value=${editComment.previousElementSibling.previousElementSibling.firstElementChild.innerHTML}>`
    editComment.classList.add('d-none')
    editComment.nextElementSibling.classList.remove('d-none')
  })
}
