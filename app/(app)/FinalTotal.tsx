import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Stack, useLocalSearchParams } from "expo-router";
import { ImageBackground, View, Text, TouchableOpacity } from "react-native";
import { useUserInfo } from "../../context/userInfoContext";
import TotalLine from "../../components/FinalTotalComponents/TotalLine";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { usePayPeriod } from "../../context/payPeriodDataContext";

const image = require("../../assets/images/bgImage.png");

export default function FinalTotal() {
  const { indexInMonth } = useLocalSearchParams();
  const userInfo = useUserInfo();
  const payPeriod = usePayPeriod();
  // variable to decide between rendering gross or netpay
  const [display, setDisplay] = useState("net");

  let workDaysInPayPeriod =
    payPeriod![parseInt(indexInMonth as string)].workDaysInPayPeriod;

  let { netIncome } = payPeriod![parseInt(indexInMonth as string)];

  let premiumTypes = [
    { type: "Base Pay", key: "baseHoursWorked", rateMultiplier: 1 },
    { type: "STIIP", key: "stiipHours", rateMultiplier: 0.75 },
    { type: "SKPD", key: "sickPaidHours", rateMultiplier: 1 },
    { type: "OT 1.5", key: "OTOnePointFive", rateMultiplier: 1.5 },
    { type: "OT 2.0", key: "OTDoubleTime", rateMultiplier: 2.0 },
    { type: "OTStatReg", key: "OTStatReg", rateMultiplier: 2.0 },
    { type: "OTSPRStat", key: "OTSuperStat", rateMultiplier: 2.5 },
  ];

  let totalLines = premiumTypes.map((premium, index) => {
    const hoursTotal = workDaysInPayPeriod.reduce(
      (total, day) =>
        total + (day[premium.key] ? (day[premium.key] as number) : 0),
      0
    );
    const premiumRate = (
      parseFloat(userInfo?.hourlyWage!) * premium.rateMultiplier
    ).toFixed(2);
    const premiumTotal =
      hoursTotal > 0
        ? (
            parseFloat(userInfo?.hourlyWage!) *
            premium.rateMultiplier *
            hoursTotal
          ).toFixed(2)
        : "0.00";

    return {
      premiumType: premium.type,
      hoursTotal: hoursTotal > 0 ? hoursTotal : 0,
      premiumRate: premiumRate,
      premiumTotal: premiumTotal,
    };
  });

  let baseHoursWorkedInPayPeriod = workDaysInPayPeriod.reduce(
    (total, day) => total + day.baseHoursWorked,
    0
  );
  let nightHoursWorked = workDaysInPayPeriod.reduce(
    (total, day) => total + day.nightHoursWorked,
    0
  );
  let alphaTotal = workDaysInPayPeriod.reduce(
    (total, day) => total + day.alphaNightsEarnings,
    0
  );
  let nightEarnings = workDaysInPayPeriod.reduce(
    (total, day) => total + day.nightEarnings,
    0
  );
  let weekendHours = workDaysInPayPeriod.reduce(
    (total, day) => total + day.weekendHoursWorked,
    0
  );
  let weekendTotal = workDaysInPayPeriod.reduce(
    (total, day) => total + day.weekendEarnings,
    0
  );
  let stiipHours = workDaysInPayPeriod.reduce(
    (total, day) => total + (day.stiipHours ? day.stiipHours : 0),
    0
  );
  let biWeeklyEarnings = workDaysInPayPeriod.reduce(
    (total, day) => total + day.dayTotal,
    0
  );
  let RDayInPeriod = workDaysInPayPeriod.find(
    (day) => day.rotation === "R Day" || day.rotation === "R Day OT"
  );

  let statDayInPeriod = workDaysInPayPeriod.find((day) => day.OTStatReg! > 0);

  let OTStatReg = 0;
  if (statDayInPeriod) {
    OTStatReg = statDayInPeriod.OTStatReg!;
  }

  let superStatDaysInPeriod = workDaysInPayPeriod.filter(
    (day) => day.OTSuperStat! > 0
  );

  let OTSuperStat = 0;
  if (superStatDaysInPeriod) {
    OTSuperStat = superStatDaysInPeriod.reduce(
      (total, day) => total + day.OTSuperStat!,
      0
    );
  }

  let sickPaidHours = 0;
  let fullPaidSickDaysInPeriod = workDaysInPayPeriod.filter(
    (day) => day.sickPaidHours && day.sickPaidHours > 0
  );
  if (fullPaidSickDaysInPeriod) {
    sickPaidHours = fullPaidSickDaysInPeriod.reduce(
      (total, day) => total + day.sickPaidHours!,
      0
    );
  }

  let levellingHoursTotal =
    (userInfo?.shiftPattern === "Alpha" ? 80 : 77) -
    (baseHoursWorkedInPayPeriod +
      stiipHours +
      sickPaidHours +
      (statDayInPeriod ? OTStatReg : 0) +
      (superStatDaysInPeriod ? OTSuperStat : 0));

  let levellingPremiumRate = userInfo?.hourlyWage!;
  let levellingPremiumTotal = (
    levellingHoursTotal * parseFloat(userInfo?.hourlyWage!)
  ).toFixed(2);

  let levellingEntry = {
    premiumType: "Levelling",
    hoursTotal: levellingHoursTotal > 0 ? levellingHoursTotal : 0,
    premiumRate: levellingPremiumRate,
    premiumTotal: levellingPremiumTotal,
  };

  let alphaPPremiumRate = "3.60"; // Fixed premium rate for "Alpha as of 2024"

  let alphaPEntry = {
    premiumType: "Alpha P",
    hoursTotal: alphaTotal > 0 ? parseFloat((alphaTotal / 3.6).toFixed(2)) : 0,
    premiumRate: alphaPPremiumRate,
    premiumTotal: alphaTotal.toFixed(2),
  };

  let nightEntry = {
    premiumType: "Night Shift",
    hoursTotal: parseFloat(nightHoursWorked.toFixed(2)),
    premiumRate: "2.00",
    premiumTotal: nightEarnings.toFixed(2),
  };

  let weekendEntry = {
    premiumType: "Weekend",
    hoursTotal: parseFloat(weekendHours.toFixed(2)),
    premiumRate: "2.25",
    premiumTotal: weekendTotal.toFixed(2),
  };

  totalLines.push(levellingEntry, alphaPEntry, nightEntry, weekendEntry);

  // biweekly earnings includes the 8.29 uniform allowance and levelling
  biWeeklyEarnings =
    biWeeklyEarnings +
    ((userInfo?.shiftPattern === "Alpha" ? 80 : 77) -
      (baseHoursWorkedInPayPeriod +
        stiipHours +
        sickPaidHours +
        (RDayInPeriod ? 12 : 0) +
        (statDayInPeriod ? OTStatReg : 0) +
        (superStatDaysInPeriod ? OTSuperStat : 0))) *
      parseFloat(userInfo?.hourlyWage!) +
    8.29;

  return (
    <ImageBackground source={image} style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            shadowColor: "rgba(0, 0, 0, 0.25)",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowRadius: 25,
            shadowOpacity: 1,
            elevation: 5,
          }}
          className="rounded-2xl bg-white shadow-sm h-5/6 w-5/6 border-0 p-3 flex flex-col justify-between"
        >
          <View className="flex flex-col justify-between">
            <View>
              <Text className="text-3xl text-center font-semibold underline decoration-[#379D9F]">
                Final Total
              </Text>
            </View>
            {totalLines
              .filter((totalLine) => totalLine.hoursTotal > 0)
              .map((totalLine, index) => (
                <TotalLine
                  key={index}
                  premiumType={totalLine.premiumType}
                  hoursTotal={totalLine.hoursTotal}
                  premiumRate={totalLine.premiumRate}
                  premiumTotal={totalLine.premiumTotal}
                  bgColor={index}
                />
              ))}
            <View>
              <View
                style={{
                  borderBottomColor: "#D9D9D9",
                  borderBottomWidth: 2,
                  width: "100%",
                }}
              ></View>
            </View>
          </View>

          <Link href={"/deductionsModal"} asChild>
            <TouchableOpacity className="border bg-white rounded-2xl w-1/2 self-center shadow-lg border-rose-300 p-2">
              <Text className="text-center text-red-500">Deductions</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity
            className="bg-white rounded-2xl w-3/4 self-center shadow-lg p-2 border border-[#379D9F]"
            onPress={() =>
              display === "net" ? setDisplay("gross") : setDisplay("net")
            }
          >
            <Text className="text-center text-xl font-bold">
              {display === "net" ? "Total Net Pay" : "Total Gross Pay"}
            </Text>
            <View
              className="flex flex-row justify-center "
              style={{ alignItems: "center" }}
            >
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={24}
                color="#379D9F"
              />
              <Text className="text-[#379D9F]">
                {format(
                  new Date(
                    payPeriod![parseInt(indexInMonth as string)]
                      .payDay as string
                  ),
                  "PP"
                )}{" "}
              </Text>
            </View>
            <View className="flex flex-row justify-center py-2">
              <Text className="text-3xl font-extrabold">
                $
                {display === "net"
                  ? netIncome.toFixed(2)
                  : biWeeklyEarnings.toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
