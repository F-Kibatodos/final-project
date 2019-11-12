$(function () {
  function calFinalAmount() {
    console.log('====discount====', $("#discount-price").text())

    const finalAmount = $('#discount-price').length > 0 ? Number($("#discount-price").text()) + Number($("#shipping-fee").text()) : Number($("#total-price").text()) + Number($("#shipping-fee").text())
    console.log(finalAmount)
    $("#final-amount").text(finalAmount)
    $("input[name=amount]").val(finalAmount)
  }
  $("input[name=shipping_method]").click(function () {
    let shippingMethod = $("input[name=shipping_method]:checked").val()
    console.log('abc', shippingMethod)
    if (shippingMethod === "自取") {
      $("#shipping-fee").text("0")
      $("#address").val("無")
      $("#address").prop('readonly', true)
    }
    if (shippingMethod === "外送") {
      $("#shipping-fee").text("60")
      $("#address").val("")
      $("#address").prop('readonly', false)
    }
    calFinalAmount()
  })
  $("input[name=shipping_method]").prop("checked", false)
  calFinalAmount()
})