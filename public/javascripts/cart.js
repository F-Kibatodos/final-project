$(function () {
  if ($("#all").hasClass('all')) { $(".check").prop("checked", true) }
  function calPrice() {
    let totalPrice = 0
    $(".check:checked").each(function () {
      totalPrice += Number($(this).attr("data-price"))
    })
    $("#total-price").html(`<i class="fas fa-dollar-sign"></i> Total: ${totalPrice}`)
    $("#total-price").attr("data-totalPrice", totalPrice)
  }
  function calQuantity() {
    let totalQuantity = 0
    $(".check:checked").each(function () {
      totalQuantity += Number($(this).attr("data-quantity"))
    })
    $("#total-quantity").html(`<i class="fas fa-coffee"></i> 總共 ${totalQuantity} 杯`)
  }
  function checkCoupon() {
    $("#use-coupon").val("")
    $("#discount-price").text("")
    let couponCode = $("#coupon-code").val()
    fetch(`/check-coupon/api/?coupon=${couponCode}`).then(response => {
      return response.json()
    }).then(data => {
      if (data.checkResult === "invalid") {
        $("#coupon-result").text("此折價券無效").removeClass("text-success").addClass("text-danger")
      }
      if (data.checkResult === "valid") {
        $("#coupon-result").text("此折價券可用").removeClass("text-danger").addClass("text-success")
        let totalPrice = Number($("#total-price").attr("data-totalPrice"))
        let discountPrice
        if (totalPrice < data.limit) {
          $("#discount-price").removeClass("text-success").addClass("text-danger")
          $("#discount-price").text(`還差${data.limit - totalPrice}元達折扣門檻`)
        }
        else {
          if (data.description === "% off") {
            if (totalPrice >= data.limit) {
              discountPrice = Math.round(totalPrice * (1 - (data.figure / 100)))
              $("#discount-price").removeClass("text-danger").addClass("text-success")
              $("#discount-price").html(`<i class="fas fa-tags"></i> 折扣後: ${discountPrice}元`)
              $("#use-coupon").val(couponCode)
            }
          }
          if (data.description === "minus") {
            if (totalPrice >= data.limit) {
              discountPrice = totalPrice - data.figure
              $("#discount-price").removeClass("text-danger").addClass("text-success")
              $("#discount-price").html(`<i class="fas fa-tags"></i> 折扣後: ${discountPrice}元`)
              $("#use-coupon").val(couponCode)
            }
          }
        }
      }
    })
  }
  $(".check").change(calPrice
  )
  $(".check").change(checkCoupon
  )
  $(".check").change(calQuantity
  )
  $("#check-coupon").click(
    checkCoupon
  )
  calPrice()
  calQuantity()
})