

export default {
    priceToNumber : (priceString) => {
        var cur_re = /\D*(\d+|\d.*?\d)(?:\D+(\d{2}))?\D*$/;
        var parts = cur_re.exec(priceString);
        var number = parseFloat(parts[1].replace(/\D/,'')+'.'+(parts[2]?parts[2]:'00'));

        return number
    }
}