import axiosInstance from "../../utils/helpers/axiosInstance";
import { useUserInfo } from "../../context/userInfoContext";
import {
  usePayPeriod,
  usePayPeriodDispatch,
} from "../../context/payPeriodDataContext";
import { TouchableOpacity, View, Text } from "react-native";
import { DateTime } from "luxon";

export default function VacationToggle({
  index,
  indexInMonth,
}: {
  index: number;
  indexInMonth: number;
}) {
  const userInfo = useUserInfo();
  const payPeriod = usePayPeriod();
  const payPeriodDispatch = usePayPeriodDispatch();
  const currentDay = payPeriod![indexInMonth].workDaysInPayPeriod[index];

  const handleAddVacation = async () => {
    // if payperiod day is already set to a vacation, user is deselecting the option so remove the vacation and fetch default days data. Will need to check if the deselected vacation block all falls within 1 pay period, or spans multiple to know what to update with the default days
    if (currentDay.rotation === "Vacation") {
      if (index <= 10) {
        for (let i = index; i < index + 4; i++) {
          try {
            let response = await axiosInstance.post(
              "/getPayData/getDefaultDay",
              {
                userInfo,
                date: payPeriod![indexInMonth].workDaysInPayPeriod[i].date,
                collectionInDB: "holidayBlocks",
                monthAndYear: new Date(
                  payPeriod![indexInMonth].payDay
                ).toLocaleDateString("en-us", {
                  month: "long",
                  year: "numeric",
                }),
                // js Dates are 0 indexed so december is 11, endpoint uses schedule generation that is 1 indexed
                month: new Date(payPeriod![indexInMonth].payDay).getMonth() + 1,
                year: new Date(payPeriod![indexInMonth].payDay).getFullYear(),
                index: i,
                payDay: payPeriod![indexInMonth].payDay,
              }
            );
            if (payPeriodDispatch) {
              payPeriodDispatch({
                type: "updateSingleDay",
                payload: {
                  indexInMonth,
                  indexInWorkDays: i,
                  updatedSingleDay: response.data.data,
                },
              });
            }
          } catch (error) {
            console.log(error);
          }
        }
      } else if (index > 10 && indexInMonth < payPeriod!.length - 1) {
        // loop from current index to end of pay period and fetch default days
        for (let i = index; i < 14; i++) {
          try {
            let response = await axiosInstance.post(
              "/getPayData/getDefaultDay",
              {
                userInfo,
                date: payPeriod![indexInMonth].workDaysInPayPeriod[i].date,
                collectionInDB: "holidayBlocks",
                monthAndYear: new Date(
                  payPeriod![indexInMonth].payDay
                ).toLocaleDateString("en-us", {
                  month: "long",
                  year: "numeric",
                }),
                // js Dates are 0 indexed so december is 11, endpoint uses schedule generation that is 1 indexed
                month: new Date(payPeriod![indexInMonth].payDay).getMonth() + 1,
                year: new Date(payPeriod![indexInMonth].payDay).getFullYear(),
                index: i,
                payDay: payPeriod![indexInMonth].payDay,
              }
            );
            if (payPeriodDispatch) {
              payPeriodDispatch({
                type: "updateSingleDay",
                payload: {
                  indexInMonth,
                  indexInWorkDays: i,
                  updatedSingleDay: response.data.data,
                },
              });
            }
          } catch (error) {
            console.log(
              error +
                " error updating single day with day thats not at the start of the block"
            );
          }
        }
        // update the days in the next pay period with default days from server
        let shiftsToFetchInNextPayPeriod = index - 10;
        for (let i = 0; i < shiftsToFetchInNextPayPeriod; i++) {
          try {
            let response = await axiosInstance.post(
              "/getPayData/getDefaultDay",
              {
                userInfo,
                date: payPeriod![indexInMonth + 1].workDaysInPayPeriod[i].date,
                collectionInDB: "holidayBlocks",
                monthAndYear: new Date(
                  payPeriod![indexInMonth + 1].payDay
                ).toLocaleDateString("en-us", {
                  month: "long",
                  year: "numeric",
                }),
                // js Dates are 0 indexed so december is 11, endpoint uses schedule generation that is 1 indexed
                month:
                  new Date(payPeriod![indexInMonth + 1].payDay).getMonth() + 1,
                year: new Date(
                  payPeriod![indexInMonth + 1].payDay
                ).getFullYear(),
                index: i,
                payDay: payPeriod![indexInMonth + 1].payDay,
              }
            );
            if (payPeriodDispatch) {
              payPeriodDispatch({
                type: "updateSingleDay",
                payload: {
                  indexInMonth: indexInMonth + 1,
                  indexInWorkDays: i,
                  updatedSingleDay: response.data.data,
                },
              });
            }
          } catch (error) {}
        }
      } else if (index > 10 && indexInMonth === payPeriod!.length - 1) {
        // loop from current index to end of pay period and fetch default days
        for (let i = index; i < 14; i++) {
          try {
            let response = await axiosInstance.post(
              "/getPayData/getDefaultDay",
              {
                userInfo,
                date: payPeriod![indexInMonth].workDaysInPayPeriod[i].date,
                collectionInDB: "holidayBlocks",
                monthAndYear: new Date(
                  payPeriod![indexInMonth].payDay
                ).toLocaleDateString("en-us", {
                  month: "long",
                  year: "numeric",
                }),
                // js Dates are 0 indexed so december is 11, endpoint uses schedule generation that is 1 indexed
                month: new Date(payPeriod![indexInMonth].payDay).getMonth() + 1,
                year: new Date(payPeriod![indexInMonth].payDay).getFullYear(),
                index: i,
                payDay: payPeriod![indexInMonth].payDay,
              }
            );
            if (payPeriodDispatch) {
              payPeriodDispatch({
                type: "updateSingleDay",
                payload: {
                  indexInMonth,
                  indexInWorkDays: i,
                  updatedSingleDay: response.data.data,
                },
              });
            }
          } catch (error) {
            console.log(
              error +
                " error updating single day with day thats not at the start of the block"
            );
          }
        }
        // after looping through to the end of the pay period, calculate how many days need to be deleted from the database that fell in the next months pay period and send those to the database for deletion
        let shiftsToFetchInNextPayPeriod = index - 10;
        let vacationDatesInNextPeriod = [];
        // start at the last day in the pay period
        for (let i = 1; i <= shiftsToFetchInNextPayPeriod; i++) {
          let lastDateInPayPeriod = new Date(
            payPeriod![indexInMonth].workDaysInPayPeriod[13].date
          );

          let nextDate = new Date(lastDateInPayPeriod);
          nextDate.setDate(lastDateInPayPeriod.getDate() + i);
          vacationDatesInNextPeriod.push(nextDate);
        }

        let payDay = new Date(payPeriod![indexInMonth].payDay);
        let nextPayDay = new Date(payDay);
        nextPayDay.setDate(payDay.getDate() + 14);

        try {
          let response = await axiosInstance.post("/getPayData/deleteDay", {
            userInfo,
            collectionInDB: "holidayBlocks",
            monthAndYear: nextPayDay.toLocaleDateString("en-us", {
              month: "long",
              year: "numeric",
            }),
            dates: vacationDatesInNextPeriod,
          });
          console.log(response.data.data);
        } catch (error) {
          console.log(error + " error deleting days from db in next month");
        }
      }
    } else {
      // initialize a vacation dates array that will be filled with the dates needed from backend
      let vacationDates = [];
      // add 2 if statements to check for 2 possible cases, 1 where index is greater than 10 and indexInMonth is less than the length of the payPeriod array minus 1, because if the indexInMonth is equal to the payPeriod array length minus 1, that means that the indexInMonth and the pay period currently being edited, is the last pay period for the month, and the vacation days being toggled are going to need to be logged in the next month. if index > 10 and indexInMonth < payPeriod.length - 1, then log however many vacation days are left in the pay period under the first payday, and the rest in the payday after the current one
      if (index > 10 && indexInMonth < payPeriod!.length - 1) {
        // collect all the shifts from the index to the end of the pay period
        try {
          for (let i = index; i < 14; i++) {
            const { date, rotation, shiftStart, shiftEnd } =
              payPeriod![indexInMonth].workDaysInPayPeriod[i];
            vacationDates.push({
              date,
              rotation,
              shiftStart,
              shiftEnd,
              payDay: payPeriod![indexInMonth].payDay,
              index: i,
            });
          }
          let response = await axiosInstance.post(
            "/getPayData/addHolidayBlock",
            {
              userInfo,
              vacationDates,
            }
          );
          if (payPeriodDispatch) {
            payPeriodDispatch({
              type: "updateHolidayBlock",
              payload: {
                indexInMonth: indexInMonth,
                indexInWorkDays: index,
                updatedDays: response.data.data,
              },
            });
          }
          // after collecting the shifts in the current pay period, calculate how many need to be added in the second pay period
          let shiftsToFetchInNextPayPeriod =
            index - (currentDay.rotation === "Day 1" ? 10 : 11);
          let vacationDatesInNextPeriod = [];
          for (let i = 0; i < shiftsToFetchInNextPayPeriod; i++) {
            const { date, rotation, shiftStart, shiftEnd } =
              payPeriod![indexInMonth + 1].workDaysInPayPeriod[i];
            vacationDatesInNextPeriod.push({
              date,
              rotation,
              shiftStart,
              shiftEnd,
              payDay: payPeriod![indexInMonth + 1].payDay,
              index: i,
            });
          }
          response = await axiosInstance.post("/getPayData/addHolidayBlock", {
            userInfo,
            vacationDates: vacationDatesInNextPeriod,
          });

          if (payPeriodDispatch) {
            payPeriodDispatch({
              type: "updateHolidayBlock",
              payload: {
                // need to update the next payperiod with these vacation dates
                indexInMonth: indexInMonth + 1,
                // the array should hold either 1,2 or 3 vacation dates, and they need to be inserted starting at the first index of the next pay period
                indexInWorkDays: 0,
                updatedDays: response.data.data,
              },
            });
          }
        } catch (error) {
          console.log(error + "error getting vacation dates");
        }
        // if statement to check if the vacation days being added span 2 pay periods and the 2nd pay period is in the next month
      } else if (index > 10 && indexInMonth === payPeriod!.length - 1) {
        // collect all shifts from index to end of pay period
        for (let i = index; i < 14; i++) {
          const { date, rotation, shiftStart, shiftEnd } =
            payPeriod![indexInMonth].workDaysInPayPeriod[i];
          vacationDates.push({
            date,
            rotation,
            shiftStart,
            shiftEnd,
            payDay: payPeriod![indexInMonth].payDay,
            index: i,
          });
        }
        try {
          let response = await axiosInstance.post(
            "/getPayData/addHolidayBlock",
            {
              userInfo,
              vacationDates,
            }
          );
          if (payPeriodDispatch) {
            payPeriodDispatch({
              type: "updateHolidayBlock",
              payload: {
                indexInMonth: indexInMonth,
                indexInWorkDays: index,
                updatedDays: response.data.data,
              },
            });
          }
        } catch (error) {
          console.log(
            error +
              " error adding holiday block when it spans 2 periods and 2nd pay period is in next month"
          );
        }
        // after updating the vacation days in state, send the remaining shifts to the same endpoint so they can be updated in the database, but do not update them in context because context only stores 1 months payday data, and the remaining vacation days are in the next month and payday
        let shiftsToFetchInNextPayPeriod =
          index - (currentDay.rotation === "Day 1" ? 10 : 11);
        let vacationDatesInNextPeriod = [];
        // start at the last day in the pay period
        for (let i = 1; i <= shiftsToFetchInNextPayPeriod; i++) {
          let lastDateInPayPeriod = new Date(
            payPeriod![indexInMonth].workDaysInPayPeriod[13].date
          );

          let nextDate = new Date(lastDateInPayPeriod);
          nextDate.setDate(lastDateInPayPeriod.getDate() + i);
          vacationDatesInNextPeriod.push(nextDate);
        }

        let payDay = new Date(payPeriod![indexInMonth].payDay);
        let nextPayDay = new Date(payDay);
        nextPayDay.setDate(payDay.getDate() + 14);

        // month being sent to backend needs to be 1 indexed
        const month = nextPayDay.getMonth() + 1;
        const year = nextPayDay.getFullYear();
        try {
          await axiosInstance.post("/getPayData/addHolidayBlockNextMonth", {
            userInfo,
            dates: vacationDatesInNextPeriod,
            month,
            year,
            payDay: nextPayDay.toISOString(),
          });
        } catch (error) {
          console.log(
            error + " error adding vacation block spanning 2 different months"
          );
        }
      } else if (index <= 10 && currentDay.rotation === "Day 1") {
        // try/catch for logging vacation days when all 4 fall in the same pay period and the first day of the holiday block is Day 1 and not an R day
        try {
          // loop from the current index of the Day 1 shift and find the next 4 shifts to send to the server to log as a holiday block, will need to add further logic to handle 2 edge cases, 1 where the holiday block flips over into the next payday which is still in the payPeriod data, and 1 where the holiday block flips over into the next payday which is stored in the next month
          for (let i = index; i < index + 4; i++) {
            const { date, rotation, shiftStart, shiftEnd } =
              payPeriod![indexInMonth].workDaysInPayPeriod[i];
            vacationDates.push({
              date,
              rotation,
              shiftStart,
              shiftEnd,
              payDay: payPeriod![indexInMonth].payDay,
              index: i,
            });
          }
          const response = await axiosInstance.post(
            "/getPayData/addHolidayBlock",
            {
              userInfo,
              vacationDates,
            }
          );
          if (payPeriodDispatch) {
            payPeriodDispatch({
              type: "updateHolidayBlock",
              payload: {
                indexInWorkDays: index,
                indexInMonth: indexInMonth,
                updatedDays: response.data.data,
              },
            });
          }
        } catch (error) {
          console.log(error);
        }
      } else if (index < 12 && currentDay.rotation === "Day 2") {
        // if block to log holiday blocks that fall in 1 pay period but are short blocks that start on Day 2 because Day 1 was an R day
        try {
          for (let i = index; i < index + 3; i++) {
            const { date, rotation, shiftStart, shiftEnd } =
              payPeriod![indexInMonth].workDaysInPayPeriod[i];
            vacationDates.push({
              date,
              rotation,
              shiftStart,
              shiftEnd,
              payDay: payPeriod![indexInMonth].payDay,
              index: i,
            });
          }
          const response = await axiosInstance.post(
            "/getPayData/addHolidayBlock",
            {
              userInfo,
              vacationDates,
            }
          );
          if (payPeriodDispatch) {
            payPeriodDispatch({
              type: "updateHolidayBlock",
              payload: {
                indexInWorkDays: index,
                indexInMonth: indexInMonth,
                updatedDays: response.data.data,
              },
            });
          }
        } catch (error) {
          console.log(
            error +
              " error logging vacation block starting on Day 2 within 1 pay period"
          );
        }
      }
    }
  };

  return (
    <TouchableOpacity
      style={
        payPeriod![indexInMonth].workDaysInPayPeriod[index].stiipHours ||
        payPeriod![indexInMonth].workDaysInPayPeriod[index].OTDoubleTime ||
        payPeriod![indexInMonth].workDaysInPayPeriod[index].OTOnePointFive
          ? { display: "none" }
          : null
      }
      className={`rounded-2xl m-0.5 px-3 py-1 ${
        payPeriod![indexInMonth].workDaysInPayPeriod[index].rotation ===
        "Vacation"
          ? "bg-[#379D9F]"
          : "white"
      }`}
      onPress={handleAddVacation}
    >
      <Text
        className={`${
          payPeriod![indexInMonth].workDaysInPayPeriod[index].rotation ===
          "Vacation"
            ? "text-white"
            : "text-[#379D9F]"
        }`}
      >
        Vacation
      </Text>
    </TouchableOpacity>
  );
}
