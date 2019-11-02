$(function () {
  let options = $('#description option').map(function () {
    return $.trim($(this).val())
  }).get()
  let type = $('#type').text()
  for (let i = 0; i < options.length; i++) {
    if (type === options[i]) {
      $('#description option[value="' + options[i] + '"]').attr('selected', true)
    }
  }
})