import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { RadioButton } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { TimePickerModal } from "react-native-paper-dates";
import { AntDesign } from "@expo/vector-icons";
import { format, isWithinInterval } from "date-fns";
import { useUserInfo, useUserInfoDispatch } from "../context/userInfoContext";
const image = require("../assets/images/bgImage.png");

export default function StiipModal() {
  const [selected, setSelected] = useState("wholeShift");
  const [open, setOpen] = React.useState(false);
  const [endTime, setEndTime] = useState("8:30 pm");

  const userInfo = useUserInfo();
  const dispatch = useUserInfoDispatch();
  const { date } = useLocalSearchParams();

  const onDismiss = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = React.useCallback(
    ({ hours, minutes }) => {
      setOpen(false);

      let activeDay = userInfo?.payDaysForYear![
        userInfo.payDayToDisplay!
      ].payDaysInPayPeriod.find((day) => day.day.toISOString() === date);

      let scheduledStartOfShift = activeDay!.shiftStart;
      let scheudledEndOfShift = activeDay!.shiftEnd;
      console.log(activeDay!.shiftEnd);

      //   console.log({ hours, minutes });

      let dateOfBookOff = new Date(date as string);
      //   if the date the user selected when opening the stiip modal is a night shift, increment the date of book off by 1, if they booked off after midnight
      if (
        activeDay?.rotation === "Night 1" ||
        activeDay?.rotation === "Night 2"
      ) {
        dateOfBookOff.setDate(dateOfBookOff.getDate() + 1);
      }
      dateOfBookOff.setHours(hours);
      dateOfBookOff.setMinutes(minutes);

      let isValid = isWithinInterval(dateOfBookOff, {
        start: scheduledStartOfShift,
        end: scheudledEndOfShift,
      });
      console.log(isValid);
    },
    [setOpen]
  );

  const handlePress = () => {};

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 20,
      }}
    >
      <Text className="font-bold text-2xl text-center">STIIP</Text>
      <View className="flex flex-row justify-center">
        <View className="flex flex-row" style={{ alignItems: "center" }}>
          <RadioButton.Android
            value="wholeShift"
            onPress={() => setSelected("wholeShift")}
            status={selected === "wholeShift" ? "checked" : "unchecked"}
            color="#379D9F"
          />
          <Text className=" text-slate-500 text-lg">Whole Shift</Text>
        </View>
        <View className="flex flex-row" style={{ alignItems: "center" }}>
          <RadioButton.Android
            value="partialShift"
            onPress={() => setSelected("partialShift")}
            status={selected === "partialShift" ? "checked" : "unchecked"}
            color="#379D9F"
          />
          <Text className=" text-slate-500 text-lg">Partial Shift</Text>
        </View>
      </View>
      <View>
        {selected === "partialShift" ? (
          <View className="flex flex-row items-center justify-evenly">
            <Text>Time of Book Off</Text>
            <View className="flex flex-row" style={{ alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => setOpen(true)}
                className="border rounded-md border-gray-300 flex flex-row items-center p-2 justify-between"
              >
                <Text className="pr-3">{endTime}</Text>
                <AntDesign name="clockcircle" size={20} color="gray" />
              </TouchableOpacity>
            </View>
            <TimePickerModal
              visible={open}
              onDismiss={onDismiss}
              onConfirm={onConfirm}
              hours={12}
              minutes={14}
            />
          </View>
        ) : null}
      </View>
      <StatusBar style="light" />
    </View>
  );
}
