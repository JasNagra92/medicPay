import React from "react";
import { View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useUserInfo } from "../../context/userInfoContext";
import { format } from "date-fns";
import ToggleSwitch from "./ToggleSwitch";
import { ISingleDaysPayData } from "../../interfaces/IAppState";
import VacationToggle from "./VacationToggle";

export interface ISingleDaysPayDataWithIndex extends ISingleDaysPayData {
  index: number;
  indexInMonth: number;
}

export default function DaySummary({
  date,
  rotation, //Day 1, Day 2, Night 1 //
  shiftStart,
  shiftEnd,
  baseHoursWorked,
  baseWageEarnings,
  nightHoursWorked,
  alphaNightsEarnings,
  nightEarnings,
  weekendHoursWorked,
  weekendEarnings,
  dayTotal,
  stiipHours,
  OTOnePointFive,
  OTDoubleTime,
  OTStatReg,
  OTSuperStat,
  index,
  indexInMonth,
}: ISingleDaysPayDataWithIndex) {
  const userInfo = useUserInfo();
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
      }}
      className="pt-3 flex flex-col rounded-2xl bg-white divide-y divide-gray-300 divide-opacity-25"
    >
      <View className="px-3 flex flex-col">
        <View className="flex-1/3 flex flex-row justify-between">
          <View className="flex flex-row">
            <View className="rounded-lg overflow-hidden mb-1">
              <Text className="bg-[#379D9F] flex flex-1/3 p-1.5 text-white font-bold">
                {rotation}
              </Text>
            </View>
            <Text className=" p-1.5 font-bold">{`${format(
              new Date(shiftStart),
              "p"
            )} - ${format(new Date(shiftEnd), "p")}`}</Text>
          </View>
        </View>
        <View className="flex-1/3 py-0.5 flex-row justify-between">
          <Text className="font-bold mt-2">
            {new Date(date).toDateString()}
          </Text>
          {
            <ToggleSwitch
              date={new Date(date)}
              index={index}
              rotation={rotation}
              shiftStart={shiftStart}
              shiftEnd={shiftEnd}
              indexInMonth={indexInMonth}
            />
          }
        </View>
      </View>

      <View className="flex flex-col py-1">
        <View className="flex flex-row px-3">
          <Text className="opacity-30 flex-1">Base Pay</Text>
          <Text className="flex-2">
            {baseHoursWorked.toFixed(2)} Hrs x ${userInfo?.hourlyWage}
          </Text>
          <Text className="flex-1 text-right">
            {" "}
            ${baseWageEarnings.toFixed(2)}
          </Text>
        </View>
        {alphaNightsEarnings > 0 ? (
          <View className="flex flex-row px-3">
            <Text className="opacity-30 flex-1">Alpha P</Text>
            <Text className="flex-2">
              {nightHoursWorked.toFixed(2)} Hrs x $3.60
            </Text>
            <Text className="flex-1 text-right">
              {" "}
              ${alphaNightsEarnings.toFixed(2)}
            </Text>
          </View>
        ) : null}
        <View className="flex flex-row px-3">
          <Text className="opacity-30 flex-1">Night P</Text>
          <Text className="flex-2">
            {nightHoursWorked.toFixed(2)} Hrs x $2.00
          </Text>
          <Text className="flex-1 text-right">
            {" "}
            ${nightEarnings.toFixed(2)}
          </Text>
        </View>
        <View className="flex flex-row px-3">
          <Text className="opacity-30 flex-1">Weekend P</Text>
          <Text className="flex-2">
            {weekendHoursWorked.toFixed(2)} Hrs x $2.50
          </Text>
          <Text className="flex-1 text-right">
            {" "}
            ${weekendEarnings.toFixed(2)}
          </Text>
        </View>
        {stiipHours && (
          <View className="flex flex-row px-3">
            <Text className="opacity-30 flex-1">STIIP</Text>
            <Text className="flex-2">
              {stiipHours.toFixed(2)} Hrs x $
              {(0.75 * parseFloat(userInfo?.hourlyWage!)).toFixed(2)}
            </Text>
            <Text className="flex-1 text-right">
              {" "}
              $
              {(
                stiipHours *
                (0.75 * parseFloat(userInfo?.hourlyWage!))
              ).toFixed(2)}
            </Text>
          </View>
        )}
        {OTOnePointFive !== undefined && OTOnePointFive > 0 && (
          <View className="flex flex-row px-3">
            <Text className="opacity-30 flex-1">OT 1.5</Text>
            <Text className="flex-2">
              {OTOnePointFive.toFixed(2)} Hrs x $
              {1.5 * parseInt(userInfo?.hourlyWage!)}
            </Text>
            <Text className="flex-1 text-right">
              {" "}
              $
              {(
                OTOnePointFive *
                (1.5 * parseFloat(userInfo?.hourlyWage!))
              ).toFixed(2)}
            </Text>
          </View>
        )}
        {OTDoubleTime !== undefined && OTDoubleTime > 0 && (
          <View className="flex flex-row px-3">
            <Text className="opacity-30 flex-1">OT 2.0</Text>
            <Text className="flex-2">
              {OTDoubleTime.toFixed(2)} Hrs x $
              {2.0 * parseInt(userInfo?.hourlyWage!)}
            </Text>
            <Text className="flex-1 text-right">
              {" "}
              $
              {(
                OTDoubleTime *
                (2.0 * parseFloat(userInfo?.hourlyWage!))
              ).toFixed(2)}
            </Text>
          </View>
        )}
        {OTStatReg !== undefined && OTStatReg > 0 && (
          <View className="flex flex-row px-3">
            <Text className="opacity-30 flex-1">OTStatReg</Text>
            <Text className="flex-2">
              {OTStatReg.toFixed(2)} Hrs x $
              {2.0 * parseInt(userInfo?.hourlyWage!)}
            </Text>
            <Text className="flex-1 text-right">
              {" "}
              $
              {(OTStatReg * (2.0 * parseFloat(userInfo?.hourlyWage!))).toFixed(
                2
              )}
            </Text>
          </View>
        )}
        {OTSuperStat !== undefined && OTSuperStat > 0 && (
          <View className="flex flex-row px-3">
            <Text className="opacity-30 flex-1">OTSuperStat</Text>
            <Text className="flex-2">
              {OTSuperStat.toFixed(2)} Hrs x $
              {2.5 * parseInt(userInfo?.hourlyWage!)}
            </Text>
            <Text className="flex-1 text-right">
              {" "}
              $
              {(
                OTSuperStat *
                (2.5 * parseFloat(userInfo?.hourlyWage!))
              ).toFixed(2)}
            </Text>
          </View>
        )}
        <View className="flex flex-row justify-between rounded-xl py-2 px-1 mx-1 bg-[#e1f1f1] ">
          <Text className="opacity-30">Day Total:</Text>
          <Text className="font-bold">
            ${dayTotal ? dayTotal.toFixed(2) : 0}
          </Text>
        </View>
      </View>
    </View>
  );
}
