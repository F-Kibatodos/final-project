$(function () {
  if ($("#all").hasClass('all')) { $(".check").prop("checked", true) }
  function calPrice() {
    let totalPrice = 0
    $(".check:checked").each(function () {
      totalPrice += Number($(this).attr("data-price"))
    })
    $("#total-price").html(`<i class="fas fa-dollar-sign"></i> Total: ${totalPrice}`)
  }
  function calQuantity() {
    let totalQuantity = 0
    $(".check:checked").each(function () {
      totalQuantity += Number($(this).attr("data-quantity"))
    })
    $("#total-quantity").html(`<i class="fas fa-coffee"></i> 總共 ${totalQuantity} 杯`)
  }

  $(".check").change(calPrice
  )
  $(".check").change(calQuantity
  )
  calPrice()
  calQuantity()
})