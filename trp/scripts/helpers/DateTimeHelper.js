function getDateToday() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var date = d.getFullYear() + '-' +
    (month < 10 ? '0' : '') + month + '-' +
    (day < 10 ? '0' : '') + day;
    var output = date + ' 00:00';
    return output;
}

function getDateNoTimeToday()
{
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var date = d.getFullYear() + '-' +
    (month < 10 ? '0' : '') + month + '-' +
    (day < 10 ? '0' : '') + day;
    var output = date;
    return output;
}

function getDateTimeToday() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hr = d.getHours();
    var min = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    var sec = d.getSeconds();
    var date = d.getFullYear() + '-' +
    (month < 10 ? '0' : '') + month + '-' +
    (day < 10 ? '0' : '') + day;
    var output = date + ' ' + hr + ':' + min;
    return output;
}

function getHoursMinSeconds() {
    var d = new Date();       
    var seconds = d.getTime() + 15 * 60 * 1000;
    var output = seconds;
    return output;
}


function getNegativeDateTimeToday() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    d.setTime(d.getTime() - 300000);
    var hr = d.getHours();
    var min = (d.getMinutes()<10?'0':'') + d.getMinutes();
    var sec = d.getSeconds();
    var date = d.getFullYear() + '-' +
    (month < 10 ? '0' : '') + month + '-' +
    (day < 10 ? '0' : '') + day;
    var output = date + ' ' + hr + ':' + min;
    return output;
}

function getOneMonthFromToday() {
    var d = new Date();
    d.setDate(d.getDate() + 30);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var date = d.getFullYear() + '-' +
    (month < 10 ? '0' : '') + month + '-' +
    (day < 10 ? '0' : '') + day;
    var output = date + ' 23:59';
    return output;
}

function getPreviousDay() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var date = d.getFullYear() + '-' +
    (month < 10 ? '0' : '') + month + '-' +
    (day < 10 ? '0' : '') + day;
    var output = date + ' 00:00';
    var date = { date: output, month: month, day: day,year: d.getFullYear() };
    return date;
}

function getYesterDay(_day) {
    var d = new Date();
    d.setDate(d.getDate() - _day);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hr = d.getHours();
    var min = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    var sec = d.getSeconds();
    var date = d.getFullYear() + '-' +
    (month < 10 ? '0' : '') + month + '-' +
    (day < 10 ? '0' : '') + day;
    var output = date + ' ' + hr + ':' + min;
    var dateonly = date;
    var date = { date: output, month: month, day: day, year: d.getFullYear(),datenotime: dateonly };
    return date;
}



function getFebruary1st2016() {
    return '2016-02-01 00:00';
}

function getFebruary2nd2016() {
    return '2016-02-02 1:59';
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function formatDateTime(date) {
    var d = new Date(date),
     month = '' + (d.getMonth() + 1),
     day = '' + d.getDate(),
     year = d.getFullYear();
    var hr = d.getHours();
    var min = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    var sec = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();


    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-') + ' ' + hr + ':' + min + ':' + sec;
}

var _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInSeconds(a, b) {
    // Discard the time and time-zone information.
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes());
    //return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    return Math.floor((utc2 - utc1) / 1000);


}