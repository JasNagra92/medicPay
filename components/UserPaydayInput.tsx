import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { DatePickerModal } from "react-native-paper-dates";
import { format } from "date-fns";
import { useUserInfo, useUserInfoDispatch } from "../context/userInfoContext";
import { validatePayday } from "../utils/ScheduleUtils";

export default function UserPaydayInput() {
  const [open, setOpen] = useState(false);
  const userInfo = useUserInfo();
  const dispatch = useUserInfoDispatch();

  const onDismissSingle = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = useCallback(
    (params: any) => {
      if (dispatch) {
        if (validatePayday(params.date)) {
          setOpen(false);
          dispatch({ type: "setPayday", payload: params.date });
          console.log(params.date);
        } else {
          alert("Must select a valid Pay Day(fridays only) ");
        }
      }
    },
    [setOpen]
  );

  const buttonStyle =
    "px-4 border rounded-xl border-gray-300 p-2 mt-1 flex-1 mx-3 flex flex-row justify-between items-center";

  return (
    <View className="flex flex-col">
      <Text className="ml-3 font-bold">Payday</Text>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        className="border p-2.5 mx-3 mt-1 rounded-md  border-gray-300 flex flex-row items-center"
      >
        <Text className="flex-1">
          {userInfo?.payDay
            ? format(userInfo.payDay, "MM/dd/yyyy")
            : "MM/DD/YYYY"}
        </Text>
        <AntDesign name="calendar" size={20} color="gray" />
      </TouchableOpacity>
      <DatePickerModal
        locale="en"
        mode="single"
        visible={open}
        onDismiss={onDismissSingle}
        date={userInfo?.payDay}
        onConfirm={onConfirmSingle}
      />
    </View>
  );
}
