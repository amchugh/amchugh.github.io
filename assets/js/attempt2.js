
const animspeed = 130
var decimalval = 0;
var binaryval = 0;

function updateDecimalDisplay() {
    str = decimalval.toString()
    while (str.length < 3) str = "0" + str
    $("#decimal-display .display").text(str)
}

function updateBinaryDisplay() {
    str = binaryval.toString(2)
    while (str.length < 8) str = "0" + str
    $("#binary-display .display").text(str)
}

$(function () {
    updateDecimalDisplay()
    updateBinaryDisplay()

    // Pre-hide all the infos
    $(".info-2").hide()
    $(".info-3").hide()
    $(".info-4").hide()
    $(".info-5").hide()

    $("#decimal-display .increment").click(function () {
        decimalval += 1

        if (decimalval == 8) {
            $(".info-1").hide(animspeed)
            $(".info-2").show(animspeed)
        }

        if (decimalval == 10) {
            $(".info-2").hide(animspeed)
            $(".info-3").show(animspeed)
        }

        if (decimalval == 20) {
            $(".info-3").hide(animspeed)
            $(".info-4").show(animspeed)
        }

        if (decimalval == 21) {
            decimalval = 95
            $(".info-4").hide(animspeed)
            $(".info-5").show(animspeed)
        }

        updateDecimalDisplay()
    })

    $(".info-7").hide()

    $("#binary-display .increment").click(function () {
        binaryval += 1;
        updateBinaryDisplay()

        if (binaryval == 2) {
            $(".info-6").hide(animspeed)
            $(".info-7").show(animspeed)
        }
    })
})
