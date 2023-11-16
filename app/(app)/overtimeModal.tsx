import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
  const [startOrEndTime, setStartOrEndTime] = useState("");
  const [open, setOpen] = useState(false);
  const [updatedShiftEnd, setUpdatedShiftEnd] = useState<Date>();
  const userInfo = useUserInfo();
  const payPeriod = usePayPeriod();
  const payPeriodDataDispatch = usePayPeriodDispatch();
  const { date, index, rotation, shiftStart, shiftEnd, indexInMonth } =
    useLocalSearchParams();
  const [startTime, setStartTime] = useState(
    format(new Date(shiftStart as string), "pp")
  );
  const [endTime, setEndTime] = useState(
    format(new Date(shiftEnd as string), "pp")
  );

  const onDismiss = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = React.useCallback(
    ({ hours, minutes }: any) => {
      if (selected === "End of Shift OT") {
        let currentDay =
          payPeriod![parseInt(indexInMonth! as string)].workDaysInPayPeriod[
            parseInt(index! as string)
          ];

        let scheduledEndOfShift = new Date(currentDay?.shiftEnd!);

        let overtimeEndTime = new Date(scheduledEndOfShift);
        overtimeEndTime.setHours(hours);
        overtimeEndTime.setMinutes(minutes);

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
      } else if (selected === "Regular OT" && startOrEndTime === "start") {
        // logic to handle user setting a start time for the start of a regular overtime shift. Will have to
      }
    },

    [setOpen]
  );

  const handleSubmitOT = async () => {
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
        payPeriodDataDispatch({
          type: "updateSingleDay",
          payload: {
            indexInWorkDays: parseInt(index! as string),
            indexInMonth: parseInt(indexInMonth! as string),
            updatedSingleDay: response.data.data,
          },
        });
      } catch (error) {
        console.log(error);
      }
    } else {
    }
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View className="p-3 flex flex-col flex-1 justify-evenly">
      <Text className="font-bold text-2xl text-center">Overtime</Text>
      <View className="flex flex-row justify-center">
        {/* don't render end of shift OT option if toggle switch is being rendered in a day off component instead render the regular OT option */}
        {rotation !== "day off" ? (
          <View className="flex flex-row" style={{ alignItems: "center" }}>
            <RadioButton.Android
              value="End of Shift OT"
              onPress={() => setSelected("End of Shift OT")}
              status={selected === "End of Shift OT" ? "checked" : "unchecked"}
              color="#379D9F"
            />
            <Text className=" text-slate-500 text-lg">End of Shift OT</Text>
          </View>
        ) : (
          <View className="flex flex-row" style={{ alignItems: "center" }}>
            <RadioButton.Android
              value="Regular OT"
              onPress={() => setSelected("Regular OT")}
              status={selected === "Regular OT" ? "checked" : "unchecked"}
              color="#379D9F"
            />
            <Text className=" text-slate-500 text-lg">Regular OT</Text>
          </View>
        )}
        <View className="flex flex-row" style={{ alignItems: "center" }}>
          <RadioButton.Android
            value="Holiday Recall"
            onPress={() => setSelected("Holiday recall")}
            status={selected === "Holiday recall" ? "checked" : "unchecked"}
            color="#379D9F"
          />
          <Text className=" text-slate-500 text-lg">Holiday Recall</Text>
        </View>
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
        {selected === "Regular OT" && (
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
                <Text className="pr-3">{endTime}</Text>
                <AntDesign name="clockcircle" size={20} color="gray" />
              </TouchableOpacity>
            </View>

            <View className="flex flex-row" style={{ alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  setStartOrEndTime("end");
                  setOpen(true);
                }}
                className="border rounded-md border-gray-300 flex flex-row items-center p-2 justify-between"
              >
                <Text className="pr-3">{endTime}</Text>
                <AntDesign name="clockcircle" size={20} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
        )}
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
          <Text className="text-white text-center font-bold">Ok</Text>
        </TouchableOpacity>
      </View>
      <TimePickerModal
        visible={open}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        hours={12}
        minutes={14}
      />
      <StatusBar style="light" />
    </View>
  );
}
