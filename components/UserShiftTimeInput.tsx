import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useUserInfoDispatch } from "../context/userInfoContext";

import DropDownPicker from "react-native-dropdown-picker";

interface IUserShiftTimeInputProps {
  text: string;
}

export default function UserShiftTimeInput({ text }: IUserShiftTimeInputProps) {
  const dispatch = useUserInfoDispatch();
  const [openStartTime, setOpenStartTime] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);
  const [dayShiftStartValue, setDayShiftStartValue] = useState(0);
  const [dayShiftEndValue, setDayShiftEndValue] = useState(0);
  const [nightShiftStartValue, setNightShiftStartValue] = useState(0);
  const [nightShiftEndValue, setNightShiftEndValue] = useState(0);
  const [dayShiftStartTimes, setDayShiftStartTimes] = useState([
    { label: "0600", value: 600 },
    { label: "0630", value: 630 },
    { label: "0700", value: 700 },
  ]);
  const [dayShiftEndTimes, setDayShiftEndTimes] = useState([
    { label: "1800", value: 1800 },
    { label: "1830", value: 1830 },
    { label: "1900", value: 1900 },
  ]);
  const [nightShiftStartTimes, setNightShiftStartTimes] = useState([
    { label: "1800", value: 1800 },
    { label: "1900", value: 1900 },
  ]);
  const [nightShiftEndTimes, setNightShiftEndTimes] = useState([
    { label: "0600", value: 600 },
    { label: "0700", value: 700 },
  ]);

  function convertValueToTime(value: number) {
    // Convert the value to hours and minutes
    const hours = Math.floor(value / 100); // Extract the hours part
    const minutes = value % 100; // Extract the minutes part
    return { hours, minutes };
  }

  useEffect(() => {
    if (dispatch) {
      const time = convertValueToTime(dayShiftStartValue);
      dispatch({
        type: "setDayShiftStart",
        payload: {
          hours: time.hours,
          minutes: time.minutes,
        },
      });
    }
  }, [dayShiftStartValue]);

  useEffect(() => {
    if (dispatch) {
      const time = convertValueToTime(dayShiftEndValue);
      dispatch({
        type: "setDayShiftEnd",
        payload: {
          hours: time.hours,
          minutes: time.minutes,
        },
      });
    }
  }, [dayShiftEndValue]);

  useEffect(() => {
    if (dispatch) {
      const time = convertValueToTime(nightShiftStartValue);
      dispatch({
        type: "setNightShiftStart",
        payload: {
          hours: time.hours,
          minutes: time.minutes,
        },
      });
    }
  }, [nightShiftStartValue]);

  useEffect(() => {
    if (dispatch) {
      const time = convertValueToTime(nightShiftEndValue);
      dispatch({
        type: "setNightShiftEnd",
        payload: {
          hours: time.hours,
          minutes: time.minutes,
        },
      });
    }
  }, [nightShiftEndValue]);

  return (
    <View className="flex flex-col">
      <Text className="font-bold ml-3 mb-1">{`${text} Shift Hours`}</Text>
      <View className="flex flex-row">
        <View className="flex flex-row ml-3 mr-1">
          <DropDownPicker
            open={openStartTime}
            value={text === "Day" ? dayShiftStartValue : nightShiftStartValue}
            items={text === "Day" ? dayShiftStartTimes : nightShiftStartTimes}
            setOpen={setOpenStartTime}
            setValue={
              text === "Day" ? setDayShiftStartValue : setNightShiftStartValue
            }
            setItems={
              text === "Day" ? setDayShiftStartTimes : setNightShiftStartTimes
            }
            containerStyle={{
              width: 150,
            }}
            dropDownDirection="TOP"
            placeholder="Start Time"
          />
        </View>

        <View className="flex flex-row">
          <DropDownPicker
            open={openEndTime}
            value={text === "Day" ? dayShiftEndValue : nightShiftEndValue}
            items={text === "Day" ? dayShiftEndTimes : nightShiftEndTimes}
            setOpen={setOpenEndTime}
            setValue={
              text === "Day" ? setDayShiftEndValue : setNightShiftEndValue
            }
            setItems={
              text === "Day" ? setDayShiftEndTimes : setNightShiftEndTimes
            }
            containerStyle={{ width: 150 }}
            placeholder="End Time"
            dropDownDirection="TOP"
          />
        </View>
      </View>
    </View>
  );
}
