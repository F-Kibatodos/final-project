$(function () {
  function calFinalAmount() {
    // $("input[name=shipping_method]").prop("checked", false)
    const finalAmount = Number($("#total-price").text()) + Number($("#shipping-fee").text())
    console.log(finalAmount)
    $("#final-amount").text(finalAmount)
    $("input[name=amount]").val(finalAmount)
  }
  $("input[name=shipping_method]").click(function () {
    let shippingMethod = $("input[name=shipping_method]:checked").val()
    console.log('abc', shippingMethod)
    if (shippingMethod === "自取") {
      $("#shipping-fee").text("0")
      console.log('1')
    }
    if (shippingMethod === "外送") {
      $("#shipping-fee").text("60")
      console.log('2')
    }
    calFinalAmount()
  })
  $("input[name=shipping_method]").prop("checked", false)
  calFinalAmount()
})