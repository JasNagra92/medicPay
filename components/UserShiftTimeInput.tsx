import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TimePickerModal } from "react-native-paper-dates";
import { Feather } from "@expo/vector-icons";

interface IUserShiftTimeInputProps {
  text: string;
}

export default function UserShiftTimeInput({ text }: IUserShiftTimeInputProps) {
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState("");

  const buttonStyle =
    "px-4 border rounded-xl opacity-30 border-gray-600 p-2 mt-1 flex-1 mx-3 flex flex-row justify-between items-center";

  const onDismiss = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirm = useCallback(
    ({ hours, minutes }: any) => {
      setVisible(false);
      console.log({ hours, minutes, pressed });
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
          <Text>Start Time</Text>
          <Feather name="clock" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setVisible(true);
            setPressed(`${text} Shift End Time`);
          }}
          className={buttonStyle}
        >
          <Text>End Time</Text>
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
