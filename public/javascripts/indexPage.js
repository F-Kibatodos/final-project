$(function() {
  $('.col-md-12 .row').each(function() {
    if ($(this).children().length === 0) {
      $(this)
        .parent()
        .remove()
    }
  })
})
