var star = document.getElementById('star')
var star_li = star.getElementsByTagName('li')
var star_word = document.getElementById('star_word')
var result = document.getElementById('result')
var i = 0
var j = 0
var len = star_li.length
const buy = document.querySelector('.buy')
const toCart = document.querySelector('.to-cart')
const buyNow = document.querySelector('.buy-now')
const editComments = document.getElementsByClassName('edit-comment')
const cancelUpdates = document.getElementsByClassName('cancel-update')
let originalText
const editRelpies = document.getElementsByClassName('edit-reply')
const cancelUpdateReplies = document.getElementsByClassName(
  'cancel-update-reply'
)
let originalReplyText
for (i = 0; i < len; i++) {
  star_li[i].index = i

  star_li[i].onclick = function() {
    for (i = 0; i <= 4; i++) {
      if (i <= this.index) star_li[i].className = 'act'
      else star_li[i].classList.remove('act')
    }
  }
}
buy.addEventListener('mouseover', function(e) {
  if (e.target === toCart) buy.setAttribute('action', '/cart')
  if (e.target === buyNow) buy.setAttribute('action', '/buynow')
})

for (let editComment of editComments) {
  editComment.addEventListener('click', e => {
    originalText =
      editComment.previousElementSibling.previousElementSibling
        .firstElementChild.innerHTML
    editComment.previousElementSibling.previousElementSibling.innerHTML = `<input name="content" class="content form-control" type="text" value=${originalText}>`
    editComment.classList.add('d-none')
    editComment.nextElementSibling.classList.remove('d-none')
    editComment.nextElementSibling.nextElementSibling.classList.remove('d-none')
  })
}

for (let cancelUpdate of cancelUpdates) {
  cancelUpdate.addEventListener('click', e => {
    cancelUpdate.classList.add('d-none')
    cancelUpdate.previousElementSibling.classList.add('d-none')
    cancelUpdate.previousElementSibling.previousElementSibling.classList.remove(
      'd-none'
    )
    cancelUpdate.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML = `<p>${originalText}</p>`
  })
}

for (let editReply of editRelpies) {
  editReply.addEventListener('click', e => {
    originalReplyText =
      editReply.previousElementSibling.firstElementChild.innerText
    editReply.previousElementSibling.innerHTML = `<input name="content" class="reply-content form-control" type="text" value=${originalReplyText}>`
    editReply.classList.add('d-none')
    editReply.nextElementSibling.classList.remove('d-none')
    editReply.nextElementSibling.nextElementSibling.classList.remove('d-none')
  })
}
for (let cancelUpdateReply of cancelUpdateReplies) {
  cancelUpdateReply.addEventListener('click', e => {
    cancelUpdateReply.classList.add('d-none')
    cancelUpdateReply.previousElementSibling.classList.add('d-none')
    cancelUpdateReply.previousElementSibling.previousElementSibling.classList.remove(
      'd-none'
    )
    cancelUpdateReply.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML = `<p>${originalReplyText}</p>`
  })
}
