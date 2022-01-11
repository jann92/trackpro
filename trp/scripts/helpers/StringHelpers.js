function stripSpaces(str) {
    str = str.replace(/ +/g, "");
    return str;
}

function toLower(str) {
    str.toLowerCase();
    return str;
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}