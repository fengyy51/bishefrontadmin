export function GetCurrentDate() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    return year + "-" + addZero(month) + "-" + addZero(day);
}


export function TransDateToString(now) {
    if (typeof now === 'string')
        return now;
    if (typeof now === 'undefined')
        return '';
    if (typeof now.getFullYear() != 'undefined') {
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        return year + "-" + addZero(month) + "-" + addZero(day);
    } else
        return '';
}

function addZero(val) {
    return val < 10 ? "0" + val : val;
}

export function TransDetailDateToString(now) {
    if (typeof now === 'string')
        return now;
    if (typeof now === 'undefined')
        return '';
    if (typeof now.getFullYear() != 'undefined') {
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        var min = now.getMinutes();
        var sec = now.getSeconds();
        return year + "-" + addZero(month) + "-" + addZero(day) + "   " + addZero(hour) + ":" + addZero(min) + ":" + addZero(sec);
    } else
        return '';
}
export function TransDetailStringToDate(now) {
    if (now == null)
        return;
    //最大切割成数组长度为3  2017-08-17 20:14:20
    var section = now.split(' ', 3);
    var section_1 = section[0];
    var section_2 = section[1];
    var date = section_1.split('-');
    var time = section_2.split(':');
    var newDate = new Date(date[0], date[1], date[2], time[0], time[1], time[2]);
    return newDate;
}
