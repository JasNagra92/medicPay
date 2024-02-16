import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { RadioButton } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { TimePickerModal } from "react-native-paper-dates";
import { AntDesign } from "@expo/vector-icons";
import { format, isWithinInterval } from "date-fns";
import { useUserInfo } from "../../context/userInfoContext";
import axiosInstance from "../../utils/helpers/axiosInstance";
import {
  usePayPeriod,
  usePayPeriodDispatch,
} from "../../context/payPeriodDataContext";

export default function OvertimeModal() {
  const [selected, setSelected] = useState("");
  const [OTAlphaShift, setOTAlphaShift] = useState("");
  const [startOrEndTime, setStartOrEndTime] = useState("");
  const [open, setOpen] = useState(false);
  const [updatedShiftEnd, setUpdatedShiftEnd] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const userInfo = useUserInfo();
  const payPeriod = usePayPeriod();
  const payPeriodDataDispatch = usePayPeriodDispatch();
  const { date, index, rotation, shiftStart, shiftEnd, indexInMonth } =
    useLocalSearchParams();
  const [startTime, setStartTime] = useState<string | undefined>(undefined);
  const [endTime, setEndTime] = useState(
    format(new Date(shiftEnd as string), "pp")
  );

  const onDismiss = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = React.useCallback(
    ({ hours, minutes }: any) => {
      let currentDay =
        payPeriod![parseInt(indexInMonth! as string)].workDaysInPayPeriod[
          parseInt(index! as string)
        ];
      if (selected === "End of Shift OT") {
        let scheduledEndOfShift = new Date(currentDay?.shiftEnd!);

        let overtimeEndTime = new Date(scheduledEndOfShift);
        overtimeEndTime.setHours(hours);
        overtimeEndTime.setMinutes(minutes);
        if (overtimeEndTime.getTime() === scheduledEndOfShift.getTime()) {
          alert("end time must be later than scheduled end time");
          return;
        }

        //   users selection must be between the scheduled end time and 4 hours later, which is the max allowed OT due to WorkSafeBC
        let endTimePlus4Hours = new Date(scheduledEndOfShift);
        endTimePlus4Hours.setHours(endTimePlus4Hours.getHours() + 4);

        // Check if overtimeEndTime is within the interval
        let isValid = isWithinInterval(overtimeEndTime, {
          start: scheduledEndOfShift,
          end: endTimePlus4Hours,
        });
        isValid
          ? (setOpen(false),
            setEndTime(format(overtimeEndTime, "pp")),
            setUpdatedShiftEnd(overtimeEndTime))
          : alert("must pick a valid book off time");
      } else if (selected === "Regular OT" || selected === "Holiday recall") {
        if (startOrEndTime === "start") {
          // logic to handle user setting a start time for the start of a regular overtime shift.
          const shiftStartForRegOT = new Date(currentDay.date);
          shiftStartForRegOT.setHours(hours);
          shiftStartForRegOT.setMinutes(minutes);
          setStartTime(shiftStartForRegOT.toISOString());
          setOpen(false);
        } else {
          // else block will run when startOrEndTime is not start, only other option is endTime
          const shiftEndForRegOT = new Date(currentDay.date);
          shiftEndForRegOT.setHours(hours);
          shiftEndForRegOT.setMinutes(minutes);
          // if user selected a end time that is before the previously selected start time, that indicates a shift ending on the next day so set the date forward 1 day, only allow users to input end time if start time is not undefined to prevent users from entering end times before start times
          if (shiftEndForRegOT < new Date(startTime!)) {
            shiftEndForRegOT.setDate(shiftEndForRegOT.getDate() + 1);
            // store shift end in same variable being used for late calls because they are both dates
            setUpdatedShiftEnd(shiftEndForRegOT);
            setOpen(false);
          }
          setUpdatedShiftEnd(shiftEndForRegOT);
          setOpen(false);
        }
      }
    },

    [setOpen, selected, startOrEndTime]
  );

  const handleSubmitOT = async () => {
    let data = [];
    if (!updatedShiftEnd || !startTime) {
      alert("must select times");
      return;
    }
    setLoading(true);
    if (selected === "End of Shift OT" && payPeriodDataDispatch) {
      try {
        let response = await axiosInstance.post("/getPayData/addOvertime", {
          userInfo,
          index,
          date,
          rotation,
          payDay: format(
            new Date(payPeriod![parseInt(indexInMonth as string)].payDay),
            "PP"
          ),
          shiftStart,
          updatedShiftEnd: updatedShiftEnd!.toISOString(),
          originalShiftEnd: shiftEnd,
        });

        data = response.data.data;
      } catch (error) {
        console.log(error);
      }
    } else if (selected === "Regular OT" && payPeriodDataDispatch) {
      try {
        let response = await axiosInstance.post(
          "/getPayData/addRegularOvertime",
          {
            userInfo,
            date,
            shiftStart: startTime,
            shiftEnd: updatedShiftEnd,
            index,
            payDay: format(
              new Date(payPeriod![parseInt(indexInMonth as string)].payDay),
              "PP"
            ),
            monthAndYear: new Date(
              payPeriod![parseInt(indexInMonth as string)].payDay
            ).toLocaleDateString("en-us", {
              month: "long",
              year: "numeric",
            }),
            rotation,
            OTAlphaShift,
          }
        );
        data = response.data.data;
      } catch (error) {
        console.log(error + "adding regular OT");
      }
    } else if (selected === "Holiday recall" && payPeriodDataDispatch) {
      try {
        let response = await axiosInstance.post(
          "/getPayData/addRecallOvertime",
          {
            userInfo,
            date,
            shiftStart: startTime,
            shiftEnd: updatedShiftEnd,
            index,
            payDay: format(
              new Date(payPeriod![parseInt(indexInMonth as string)].payDay),
              "PP"
            ),
            monthAndYear: new Date(
              payPeriod![parseInt(indexInMonth as string)].payDay
            ).toLocaleDateString("en-us", {
              month: "long",
              year: "numeric",
            }),
            prevRotation:
              payPeriod![parseInt(indexInMonth as string)].workDaysInPayPeriod[
                parseInt(index as string)
              ].rotation,
            OTAlphaShift,
          }
        );
        data = response.data.data;
      } catch (error) {
        console.log(error + "adding holiday recall");
      }
    }
    if (payPeriodDataDispatch) {
      payPeriodDataDispatch({
        type: "updateSingleDay",
        payload: {
          indexInWorkDays: parseInt(index! as string),
          indexInMonth: parseInt(indexInMonth! as string),
          updatedSingleDay: data,
        },
      });
    }
    setLoading(false);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View className="p-3 flex flex-col flex-1 justify-evenly">
      <Text className="font-bold text-2xl text-center">Overtime</Text>

      {(selected === "Holiday Recall" || selected === "Regular OT") && (
        <View>
          <View
            className="flex flex-row justify-center"
            style={{ alignItems: "center" }}
          >
            <RadioButton.Android
              value="Alpha"
              onPress={() => {
                OTAlphaShift === "Alpha"
                  ? setOTAlphaShift("")
                  : setOTAlphaShift("Alpha");
              }}
              status={OTAlphaShift === "Alpha" ? "checked" : "unchecked"}
              color="#379D9F"
            />
            <Text className="text-lg text-center text-slate-500">
              Alpha Shift?
            </Text>
          </View>
          <View>
            <Text className="text-center font-semibold">
              Only Alpha shifts on OT accrue Alpha Premium
            </Text>
          </View>
        </View>
      )}
      <View className="flex flex-row justify-center">
        {/* don't render end of shift OT option if toggle switch is being rendered in a day off component instead render the regular OT option */}
        {rotation !== "day off" &&
          rotation !== "Vacation" &&
          rotation !== "R Day" && (
            <View className="flex flex-row" style={{ alignItems: "center" }}>
              <RadioButton.Android
                value="End of Shift OT"
                onPress={() => setSelected("End of Shift OT")}
                status={
                  selected === "End of Shift OT" ? "checked" : "unchecked"
                }
                color="#379D9F"
              />
              <Text className=" text-slate-500 text-lg">End of Shift OT</Text>
            </View>
          )}
        {(rotation === "day off" || rotation === "R Day") && (
          <View className="flex flex-row" style={{ alignItems: "center" }}>
            <RadioButton.Android
              value="Regular OT"
              onPress={() => setSelected("Regular OT")}
              status={selected === "Regular OT" ? "checked" : "unchecked"}
              color="#379D9F"
            />
            <Text className="text-slate-500 text-lg">Regular OT</Text>
          </View>
        )}
        {(rotation === "Vacation" || rotation === "day off") && (
          <View className="flex flex-row" style={{ alignItems: "center" }}>
            <RadioButton.Android
              value="Holiday Recall"
              onPress={() => setSelected("Holiday recall")}
              status={selected === "Holiday recall" ? "checked" : "unchecked"}
              color="#379D9F"
            />
            <Text className="text-slate-500 text-lg">Holiday Recall</Text>
          </View>
        )}
      </View>
      <View>
        {selected === "End of Shift OT" && (
          <View className="flex flex-row items-center justify-evenly">
            <Text className="text-slate-500 text-lg">End Time</Text>
            <View className="flex flex-row" style={{ alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => setOpen(true)}
                className="border rounded-md border-gray-300 flex flex-row items-center p-2 justify-between"
              >
                <Text className="pr-3">{endTime}</Text>
                <AntDesign name="clockcircle" size={20} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {selected === "Holiday recall" || selected === "Regular OT" ? (
          <View className="flex flex-row items-center justify-evenly">
            <Text className="text-slate-500 text-lg">Start/End</Text>
            <View className="flex flex-row" style={{ alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  setStartOrEndTime("start");
                  setOpen(true);
                }}
                className="border rounded-md border-gray-300 flex flex-row items-center p-2 justify-between"
              >
                <Text className="pr-3">
                  {startTime ? format(new Date(startTime!), "pp") : null}
                </Text>
                <AntDesign name="clockcircle" size={20} color="gray" />
              </TouchableOpacity>
            </View>

            <View className="flex flex-row" style={{ alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  if (startTime) {
                    setStartOrEndTime("end");
                    setOpen(true);
                  } else {
                    alert("must select start time first");
                  }
                }}
                className="border rounded-md border-gray-300 flex flex-row items-center p-2 justify-between"
              >
                <Text className="pr-3">
                  {updatedShiftEnd ? format(updatedShiftEnd!, "pp") : null}
                </Text>
                <AntDesign name="clockcircle" size={20} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
      <View className="flex flex-row justify-center">
        <TouchableOpacity
          className="p-4 mx-3 rounded-xl flex-1 bg-[#c6e4e5]"
          onPress={handleCancel}
        >
          <Text className="text-[#379D9F] text-center font-bold">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-4 mx-3 rounded-xl flex-1 bg-[#379D9F]"
          onPress={handleSubmitOT}
        >
          <Text className="text-white text-center font-bold">
            {loading ? <ActivityIndicator size={"small"} /> : "OK"}
          </Text>
        </TouchableOpacity>
      </View>
      <TimePickerModal
        visible={open}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        hours={12}
        minutes={14}
        use24HourClock={true}
      />
      <StatusBar style="light" />
    </View>
  );
}
