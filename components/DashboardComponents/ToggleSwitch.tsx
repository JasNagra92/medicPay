import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import axiosInstance from "../../utils/helpers/axiosInstance";
import {
  usePayPeriod,
  usePayPeriodDispatch,
} from "../../context/payPeriodDataContext";
import { useUserInfo } from "../../context/userInfoContext";
import { format } from "date-fns";
import VacationToggle from "./VacationToggle";

interface IToggleSwitchProps {
  date: Date;
  index: number;
  rotation: string;
  shiftStart: Date;
  shiftEnd: Date;
  indexInMonth: number;
}

export default function ToggleSwitch({
  date,
  index,
  rotation,
  shiftStart,
  shiftEnd,
  indexInMonth,
}: IToggleSwitchProps) {
  const payPeriod = usePayPeriod();
  const [selected, setSelected] = useState("");
  const router = useRouter();
  const userInfo = useUserInfo();
  const payPeriodDispatch = usePayPeriodDispatch();

  const handleStiipSelect = async () => {
    // if stiip hours already exists in the single days data, user must be depressing the button to cancel the stiip, hit api to get default day back
    if (payPeriod![indexInMonth].workDaysInPayPeriod[index].stiipHours) {
      try {
        let response = await axiosInstance.post("/getPayData/getDefaultDay", {
          userInfo,
          date,
          rotation,
          collectionInDB: "sickHours",
          monthAndYear: new Date(
            payPeriod![indexInMonth].payDay
          ).toLocaleDateString("en-us", {
            month: "long",
            year: "numeric",
          }),
        });
        if (payPeriodDispatch) {
          payPeriodDispatch({
            type: "updateSingleDay",
            payload: {
              indexInMonth,
              indexInWorkDays: index,
              updatedSingleDay: response.data.data,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      router.push({
        pathname: "/stiipModal",
        params: {
          date: date.toISOString(),
          index,
          rotation,
          shiftStart,
          shiftEnd,
          indexInMonth,
        },
      });
    }
  };

  const handleOTSelect = async () => {
    // if OT hours already exists in the single days data, user must be depressing the button to cancel the OT, hit api to get default day back
    if (
      payPeriod![indexInMonth].workDaysInPayPeriod[index].OTDoubleTime ||
      payPeriod![indexInMonth].workDaysInPayPeriod[index].OTOnePointFive
    ) {
      try {
        // info being sent is so server can delete document from the database
        let response = await axiosInstance.post("/getPayData/getDefaultDay", {
          userInfo,
          date,
          rotation,
          collectionInDB: "overtimeHours",
          monthAndYear: new Date(
            payPeriod![indexInMonth].payDay
          ).toLocaleDateString("en-us", {
            month: "long",
            year: "numeric",
          }),
        });
        if (payPeriodDispatch) {
          payPeriodDispatch({
            type: "updateSingleDay",
            payload: {
              indexInMonth,
              indexInWorkDays: index,
              updatedSingleDay: response.data.data,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      router.push({
        pathname: "/overtimeModal",
        params: {
          date: date.toISOString(),
          index,
          rotation,
          shiftStart,
          shiftEnd,
          indexInMonth,
        },
      });
    }
  };

  useEffect(() => {
    payPeriod![indexInMonth].workDaysInPayPeriod[index].stiipHours
      ? setSelected("Stiip")
      : "";
  }, []);
  useEffect(() => {
    payPeriod![indexInMonth].workDaysInPayPeriod[index].OTOnePointFive ||
    payPeriod![indexInMonth].workDaysInPayPeriod[index].OTDoubleTime
      ? setSelected("OT")
      : "";
  }, []);
  if (rotation === "day off") {
    return (
      <View
        style={{
          shadowColor: "rgba(0, 0, 0, 0.25)",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowRadius: 25,
          shadowOpacity: 1,
          elevation: 10,
        }}
        className="rounded-2xl bg-white flex flex-row mb-2"
      >
        <TouchableOpacity
          className={`rounded-2xl m-0.5 px-4 py-1 ${
            selected === "OT" ? "bg-[#379D9F]" : "white"
          }`}
          onPress={() => handleOTSelect()}
        >
          <Text
            className={`${selected === "OT" ? "text-white" : "text-[#379D9F]"}`}
          >
            OT
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View
      style={{
        shadowColor: "rgba(0, 0, 0, 0.25)",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowRadius: 25,
        shadowOpacity: 1,
        elevation: 10,
      }}
      className="rounded-2xl bg-white flex flex-row mb-2"
    >
      {rotation === "Day 1" || rotation === "Vacation" ? (
        <VacationToggle index={index} indexInMonth={indexInMonth} />
      ) : null}

      {!payPeriod![indexInMonth].workDaysInPayPeriod[index].OTDoubleTime &&
      !payPeriod![indexInMonth].workDaysInPayPeriod[index].OTOnePointFive ? (
        <TouchableOpacity
          style={rotation === "Vacation" ? { display: "none" } : null}
          className={`rounded-2xl m-0.5 px-3 py-1 ${
            payPeriod![indexInMonth].workDaysInPayPeriod[index].stiipHours
              ? "bg-[#379D9F]"
              : "white"
          }`}
          onPress={() => {
            handleStiipSelect();
          }}
        >
          <Text
            className={`${
              payPeriod![indexInMonth].workDaysInPayPeriod[index].stiipHours
                ? "text-white"
                : "text-[#379D9F]"
            }`}
          >
            Stiip
          </Text>
        </TouchableOpacity>
      ) : null}
      {!payPeriod![indexInMonth].workDaysInPayPeriod[index].stiipHours && (
        <TouchableOpacity
          className={`rounded-2xl m-0.5 px-4 py-1 ${
            payPeriod![indexInMonth].workDaysInPayPeriod[index].OTDoubleTime ||
            payPeriod![indexInMonth].workDaysInPayPeriod[index].OTOnePointFive
              ? "bg-[#379D9F]"
              : "white"
          }`}
          onPress={() => {
            handleOTSelect();
          }}
        >
          <Text
            className={`${
              payPeriod![indexInMonth].workDaysInPayPeriod[index]
                .OTDoubleTime ||
              payPeriod![indexInMonth].workDaysInPayPeriod[index].OTOnePointFive
                ? "text-white"
                : "text-[#379D9F]"
            }`}
          >
            OT
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
