import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import axiosInstance from "../../utils/helpers/axiosInstance";
import {
  usePayPeriod,
  usePayPeriodDispatch,
} from "../../context/payPeriodDataContext";
import { useUserInfo } from "../../context/userInfoContext";
import { isDayBeforeRDay } from "../../utils/helpers/seedDates";
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

  const { stiipHours, sickPaidHours, OTOnePointFive, OTDoubleTime } =
    payPeriod![indexInMonth].workDaysInPayPeriod[index];

  const handleStiipSelect = async () => {
    // if stiip hours already exists in the single days data, user must be depressing the button to cancel the stiip, hit api to get default day back
    if (
      payPeriod![indexInMonth].workDaysInPayPeriod[index].stiipHours ||
      payPeriod![indexInMonth].workDaysInPayPeriod[index].sickPaidHours
    ) {
      try {
        let response = await axiosInstance.post("/getPayData/getDefaultDay", {
          userInfo,
          date,
          collectionInDB: "sickHours",
          monthAndYear: new Date(
            payPeriod![indexInMonth].payDay
          ).toLocaleDateString("en-us", {
            month: "long",
            year: "numeric",
          }),
          // js Dates are 0 indexed so december is 11, endpoint uses schedule generation that is 1 indexed
          month: new Date(payPeriod![indexInMonth].payDay).getMonth() + 1,
          year: new Date(payPeriod![indexInMonth].payDay).getFullYear(),
          index,
          payDay: payPeriod![indexInMonth].payDay,
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
    // if OT hours exist, user already logged overtime, so hit the api to get default day back and delete the ot
    if (OTOnePointFive || OTDoubleTime || rotation === "Reg OT") {
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
          // js Dates are 0 indexed so december is 11, endpoint uses schedule generation that is 1 indexed
          month: new Date(payPeriod![indexInMonth].payDay).getMonth() + 1,
          year: new Date(payPeriod![indexInMonth].payDay).getFullYear(),
          index,
          payDay: payPeriod![indexInMonth].payDay,
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
    stiipHours || sickPaidHours ? setSelected("Stiip") : "";
  }, []);
  useEffect(() => {
    OTOnePointFive || OTDoubleTime ? setSelected("OT") : "";
  }, []);
  if (rotation === "day off" || rotation === "R Day") {
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
      {/* only days that you can start a vacation block on are either the first day of the block or the second day if the day before is an Rday and the user has a holiday block on a short block, and if its already a vacation block, render the switch so user can deselect it */}
      {rotation === "Day 1" ||
      rotation === "Vacation" ||
      isDayBeforeRDay(userInfo!, date) ? (
        <VacationToggle index={index} indexInMonth={indexInMonth} />
      ) : null}

      {!OTDoubleTime && !OTOnePointFive ? (
        <TouchableOpacity
          style={
            rotation === "Vacation" || rotation === "Reg OT"
              ? { display: "none" }
              : null
          }
          className={`rounded-2xl m-0.5 px-3 py-1 ${
            stiipHours || sickPaidHours ? "bg-[#379D9F]" : "white"
          }`}
          onPress={() => {
            handleStiipSelect();
          }}
        >
          <Text
            className={`${
              stiipHours || sickPaidHours ? "text-white" : "text-[#379D9F]"
            }`}
          >
            Stiip
          </Text>
        </TouchableOpacity>
      ) : null}
      {!stiipHours && !sickPaidHours && (
        <TouchableOpacity
          className={`rounded-2xl m-0.5 px-4 py-1 ${
            OTDoubleTime || OTOnePointFive || rotation === "Reg OT"
              ? "bg-[#379D9F]"
              : "white"
          }`}
          onPress={() => {
            handleOTSelect();
          }}
        >
          <Text
            className={`${
              OTDoubleTime || OTOnePointFive || rotation === "Reg OT"
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
