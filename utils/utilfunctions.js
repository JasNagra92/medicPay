"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var baseRate = 43.13;
var nightShiftPremium = 5.6;
var weekendPremium = 2.25;
var nightShiftStartHour = 18; // 6:00 pm //
var nightShiftEndHour = 6; // 6:00 am //
var startTime = new Date(2023, 9, 8, 18, 0, 0);
var endTime = new Date(2023, 9, 9, 6, 0, 0);
var totalEarnings = 0;
var calculateEarnings = function (shiftStart, shiftEnd) {
    var hoursWorked = (0, utils_1.getHoursWorked)(shiftStart, shiftEnd);
    for (var hour = 0; hour < hoursWorked; hour++) {
        var currentHour = (shiftStart.getHours() + hour) % 24;
        var currentDay = shiftStart.getDay();
        // adjust currentDay based on the currentHour to handle day transitions
        currentDay =
            currentHour < shiftStart.getHours() ? (currentDay + 1) % 7 : currentDay;
        var hourlyRate = baseRate;
        // First check if the given hour is within night shift hours
        if ((0, utils_1.isWithinNightShiftHours)(currentHour)) {
            hourlyRate += nightShiftPremium;
            console.log(currentDay);
            console.log("nightshift premium added");
            // further check if it is also a weekend or monday morning/friday night
            // for weekend premium
            if ((0, utils_1.isWeekend)(currentDay) ||
                (0, utils_1.isWithinFridayNightOrMondayMorning)(currentHour, currentDay)) {
                hourlyRate += weekendPremium;
                console.log("weekendPremium added");
            }
        }
        totalEarnings += hourlyRate;
    }
    return totalEarnings.toFixed(2);
};
console.log(calculateEarnings(startTime, endTime));
