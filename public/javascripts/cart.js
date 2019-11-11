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

  $(".check").change(calPrice
  )
  $(".check").change(calQuantity
  )
  $("#check-coupon").click(
    function () {
      let couponCode = $("#coupon-code").val()
      fetch(`/check-coupon/api/?coupon=${couponCode}`).then(response => {
        return response.json()
      }).then(data => {
        console.log('===abc===', typeof (data), data)
        if (data.checkResult === "invalid") {
          $("#coupon-result").text("此折價券無效")
        }
        if (data.checkResult === "valid") {
          $("#coupon-result").text("此折價券有效")
          let totalPrice = Number($("#total-price").attr("data-totalPrice"))
          let finalPrice
          if (data.description === "% off") {
            if (totalPrice >= data.limit) {
              finalPrice = Math.round(totalPrice * (1 - (data.figure / 100)))
              $("#coupon-result").text("此折價券有效")
            }
            else {
              $("#coupon-result").text("未達折扣門檻")
            }
          }
          if (data.description === "滿折") {
            if (totalPrice >= data.limit) {
              finalPrice = totalPrice - data.figure
              $("#coupon-result").text("此折價券有效")
            }
            else {
              $("#coupon-result").text("未達折扣門檻")
            }
          }
          console.log('===how===', finalPrice)
        }
      })
      // if (coupons.includes(couponCode)) {
      //   $("#coupon-result").text("This coupon is valid")
      //   localStorage.setItem('use-coupon', JSON.stringify(couponCode))
      // }
    }
  )
  // if()
  calPrice()
  calQuantity()
})