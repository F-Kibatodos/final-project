$(function () {
  if ($("#all").hasClass('all')) { $(".check").prop("checked", true) }
  function calPrice() {
    let totalPrice = 0
    $(".check:checked").each(function () {
      totalPrice += Number($(this).attr("data-price"))
    })
    $("#total-price").text(`Total: ${totalPrice}`)
  }
  function calQuantity() {
    let totalQuantity = 0
    $(".check:checked").each(function () {
      totalQuantity += Number($(this).attr("data-quantity"))
    })
    $("#total-quantity").text(`總共 ${totalQuantity} 杯`)
  }

  $(".check").change(calPrice
  )
  $(".check").change(calQuantity
  )
  calPrice()
  calQuantity()
})