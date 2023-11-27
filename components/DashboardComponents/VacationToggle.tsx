import axiosInstance from "../../utils/helpers/axiosInstance";
import { useUserInfo } from "../../context/userInfoContext";
import {
  usePayPeriod,
  usePayPeriodDispatch,
} from "../../context/payPeriodDataContext";
import { TouchableOpacity, View, Text } from "react-native";

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

  const handleAddVacation = async () => {
    // if payperiod day is already set to a vacation, user is deselecting the option so remove the vacation and fetch default days data for the picked date and the next 3
    if (
      payPeriod![indexInMonth].workDaysInPayPeriod[index].rotation ===
      "Vacation"
    ) {
      console.log(index);
      for (let i = 0; i < 4; i++) {
        try {
          let response = await axiosInstance.post("/getPayData/getDefaultDay", {
            userInfo,
            date: payPeriod![indexInMonth].workDaysInPayPeriod[index + i].date,
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
          });
          if (payPeriodDispatch) {
            payPeriodDispatch({
              type: "updateSingleDay",
              payload: {
                indexInMonth,
                indexInWorkDays: index + i,
                updatedSingleDay: response.data.data,
              },
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      try {
        let vacationDates = [];
        // loop from the current index of the Day 1 shift and find the next 4 shifts to send to the server to log as a holiday block will need to add further logic to handle 2 edge cases, 1 where the holiday block flips over into the next payday which is still in the payPeriod data, and 1 where the holiday block flips over into the next payday which is stored in the next month
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
