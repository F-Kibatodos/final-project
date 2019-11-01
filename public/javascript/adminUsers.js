$(function () {
  let loginUser = $('#loginUser').text()
  let users = $('.user').map(function () {
    return $.trim($(this).text())
  }).get()
  for (let i = 0; i < users.length; i++) {
    if (loginUser == Number((users[i]))) {
      $('#' + users[i]).remove()
    }
  }
})