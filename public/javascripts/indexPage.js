$(function () {
  let rows = $('.col-md-12 .row').map(function () {
    return $.trim($(this).text())
  }).get()
  for (let i = 0; i < rows.length; i++) {
    if (rows[i] === '') {
      selectorName = '#' + (i + 1) + ''
      $(selectorName).remove()
    }
  }
})