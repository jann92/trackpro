﻿function downloadFileString(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));

    element.setAttribute('download', filename);
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}