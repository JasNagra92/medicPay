"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHoursWorked = exports.isWeekend = exports.isWithinFridayNightOrMondayMorning = exports.isWithinNightShiftHours = void 0;
var nightShiftStartHour = 18;
var nightShiftEndHour = 6;
// function to check if the given hour is between night shift
// premium hours
function isWithinNightShiftHours(currentHour) {
    return currentHour >= nightShiftStartHour || currentHour < nightShiftEndHour
        ? true
        : false;
}
exports.isWithinNightShiftHours = isWithinNightShiftHours;
// function to check specifically if the given hour is between
// 6pm on a friday night and midnight on friday night
// or if it is on Monday morning between 0000 hours and 0600
function isWithinFridayNightOrMondayMorning(currentHour, currentDay) {
    if ((currentHour >= 18 && currentDay === 5) ||
        (currentHour < 6 && currentDay === 1)) {
        return true;
    }
    else {
        return false;
    }
}
exports.isWithinFridayNightOrMondayMorning = isWithinFridayNightOrMondayMorning;
// function to check if given hour takes place on a saturday or sunday
function isWeekend(currentDay) {
    return currentDay === 6 || currentDay === 0 ? true : false;
}
exports.isWeekend = isWeekend;
// function to return total hours worked between 2 date objects
function getHoursWorked(startTime, endTime) {
    var startTimeMS = startTime.getTime();
    var endTimeMS = endTime.getTime();
    var hoursWorked = (endTimeMS - startTimeMS) / (1000 * 60 * 60);
    return hoursWorked;
}
exports.getHoursWorked = getHoursWorked;
