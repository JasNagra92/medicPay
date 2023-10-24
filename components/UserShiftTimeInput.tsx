import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TimePickerModal } from "react-native-paper-dates";
import { Feather } from "@expo/vector-icons";
import { useUserInfo, useUserInfoDispatch } from "../context/userInfoContext";
import { IShiftTime } from "../interfaces/IAppState";

interface IUserShiftTimeInputProps {
  text: string;
}

const formatTime = (time: IShiftTime) => {
  const hours = time.hours < 10 ? `0${time.hours}` : time.hours;
  const minutes = time.minutes < 10 ? `0${time.minutes}` : time.minutes;
  return `${hours}:${minutes}`;
};

export default function UserShiftTimeInput({ text }: IUserShiftTimeInputProps) {
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState("");

  const userInfo = useUserInfo();
  const dispatch = useUserInfoDispatch();

  const buttonStyle =
    "px-4 border rounded-xl border-gray-300 p-2 mt-1 flex-1 mx-3 flex flex-row justify-between items-center";

  const onDismiss = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirm = useCallback(
    ({ hours, minutes }: any) => {
      if (dispatch) {
        switch (pressed) {
          case "Day Shift Start":
            dispatch({ type: "setDayShiftStart", payload: { hours, minutes } });
            break;
          case "Day Shift End Time":
            dispatch({ type: "setDayShiftEnd", payload: { hours, minutes } });
            break;
          case "Night Shift Start":
            dispatch({
              type: "setNightShiftStart",
              payload: { hours, minutes },
            });
            break;
          case "Night Shift End Time":
            dispatch({ type: "setNightShiftEnd", payload: { hours, minutes } });
        }
        setVisible(false);
      }
    },
    [setVisible, pressed]
  );

  return (
    <View className="flex flex-col">
      <Text className="font-bold ml-3">{`${text} Shift Hours`}</Text>
      <View className="flex flex-row justify-evenly">
        <TouchableOpacity
          onPress={() => {
            setVisible(true);
            setPressed(`${text} Shift Start`);
          }}
          className={buttonStyle}
        >
          <Text>
            {text === "Day"
              ? userInfo?.dayShiftStartTime
                ? formatTime(userInfo.dayShiftStartTime)
                : "start time"
              : userInfo?.nightShiftStartTime
              ? formatTime(userInfo.nightShiftStartTime)
              : "start time"}
          </Text>
          <Feather name="clock" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setVisible(true);
            setPressed(`${text} Shift End Time`);
          }}
          className={buttonStyle}
        >
          <Text>
            {text === "Day"
              ? userInfo?.dayShiftEndTime
                ? formatTime(userInfo.dayShiftEndTime)
                : "end time"
              : userInfo?.nightShiftEndTime
              ? formatTime(userInfo.nightShiftEndTime)
              : "end time"}
          </Text>
          <Feather name="clock" size={20} color="gray" />
        </TouchableOpacity>
        <TimePickerModal
          visible={visible}
          onDismiss={onDismiss}
          onConfirm={onConfirm}
          hours={12}
          minutes={14}
        />
      </View>
    </View>
  );
}
