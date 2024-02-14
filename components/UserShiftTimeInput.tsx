import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useUserInfo, useUserInfoDispatch } from "../context/userInfoContext";

import DropDownPicker from "react-native-dropdown-picker";

interface IUserShiftTimeInputProps {
  text: string;
}

export default function UserShiftTimeInput({ text }: IUserShiftTimeInputProps) {
  const dispatch = useUserInfoDispatch();
  const userInfo = useUserInfo();
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
    { label: "0900", value: 900 },
  ]);

  const [dayShiftEndTimes, setDayShiftEndTimes] = useState([
    { label: "1800", value: 1800 },
    { label: "1830", value: 1830 },
    { label: "1900", value: 1900 },
    { label: "2000", value: 2000 },
  ]);
  const [nightShiftStartTimes, setNightShiftStartTimes] = useState([
    { label: "1800", value: 1800 },
    { label: "1830", value: 1830 },
    { label: "1900", value: 1900 },
    { label: "1400", value: 1400 },
  ]);
  const [nightShiftEndTimes, setNightShiftEndTimes] = useState([
    { label: "0100", value: 100 },
    { label: "0600", value: 600 },
    { label: "0630", value: 630 },
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

  useEffect(() => {
    if (userInfo?.shiftPattern === "Alpha") {
      setDayShiftStartTimes([
        { label: "0600", value: 600 },
        { label: "0630", value: 630 },
        { label: "0700", value: 700 },
      ]);
      setDayShiftEndTimes([
        { label: "1800", value: 1800 },
        { label: "1830", value: 1830 },
        { label: "1900", value: 1900 },
      ]);
      setNightShiftStartTimes([
        { label: "1800", value: 1800 },
        { label: "1830", value: 1830 },
        { label: "1900", value: 1900 },
      ]);
      setNightShiftEndTimes([
        { label: "0600", value: 600 },
        { label: "0630", value: 630 },
        { label: "0700", value: 700 },
      ]);
    } else if (userInfo?.shiftPattern === "Bravo/Charlie") {
      setDayShiftStartTimes([
        { label: "0700", value: 700 },
        { label: "0900", value: 900 },
        { label: "1000", value: 1000 },
      ]);
      setDayShiftEndTimes([
        { label: "1800", value: 1800 },
        { label: "2000", value: 2000 },
        { label: "2100", value: 2100 },
      ]);
      setNightShiftStartTimes([
        { label: "1300", value: 1300 },
        { label: "1400", value: 1400 },
        { label: "1500", value: 1500 },
      ]);
      setNightShiftEndTimes([
        { label: "0000", value: 0 },
        { label: "0100", value: 100 },
        { label: "0200", value: 200 },
      ]);
    }
  }, [userInfo?.shiftPattern]);

  return (
    <View className="flex flex-col">
      <Text className="font-bold ml-3 mb-1">{`${text} Shift Hours`}</Text>
      <View className="flex flex-row justify-center">
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
          dropDownDirection="TOP"
          placeholder="Start Time"
          containerStyle={{
            width: 150,
          }}
        />

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
          placeholder="End Time"
          dropDownDirection="TOP"
          containerStyle={{
            width: 150,
          }}
        />
      </View>
    </View>
  );
}
