$(function () {
  let orderDates = $('.orderDate')
  $.each(orderDates, (key, value) => {
    orderDates[key].innerText = moment(value.innerText).local().format('YYYY-MM-DD, HH:mm')
  })
})