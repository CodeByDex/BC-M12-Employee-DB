function validateNumberValue(num, min, max) {
    if (num === "" || isNaN(num)) {
        return false;
    } else if (num >= min && num <= max) {
        return true;
    } else {
        return false;
    }
}

function validateFieldLength(res, min, max) {
    if (res.length >= min && res.length <= max) {
        return true;
    } else {
        return false;
    }
};

module.exports = {
    validateFieldLength: validateFieldLength,
    validateNumberValue: validateNumberValue
}