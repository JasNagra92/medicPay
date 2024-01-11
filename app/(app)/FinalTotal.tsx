import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams } from "expo-router";
import { ImageBackground, View, Text } from "react-native";
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

  let workDaysInPayPeriod =
    payPeriod![parseInt(indexInMonth as string)].workDaysInPayPeriod;

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
  let OTOnePointFiveHours = workDaysInPayPeriod.reduce(
    (total, day) => total + (day.OTOnePointFive ? day.OTOnePointFive : 0),
    0
  );
  let OTDoubleTime = workDaysInPayPeriod.reduce(
    (total, day) => total + (day.OTDoubleTime ? day.OTDoubleTime : 0),
    0
  );
  let biWeeklyEarnings = workDaysInPayPeriod.reduce(
    (total, day) => total + day.dayTotal,
    0
  );
  let RDayInPeriod = payPeriod![
    parseInt(indexInMonth as string)
  ].workDaysInPayPeriod.find(
    (day) => day.rotation === "R Day" || day.rotation === "R Day OT"
  );

  let statDayInPeriod = payPeriod![
    parseInt(indexInMonth as string)
  ].workDaysInPayPeriod.find((day) => day.OTStatReg! > 0);

  let OTStatReg = 0;
  if (statDayInPeriod) {
    OTStatReg = statDayInPeriod.OTStatReg!;
  }

  // biweekly earnings includes the 8.29 uniform allowance and levelling
  biWeeklyEarnings =
    biWeeklyEarnings +
    ((userInfo?.shiftPattern === "Alpha" ? 80 : 77) -
      (baseHoursWorkedInPayPeriod +
        stiipHours +
        (RDayInPeriod ? 12 : 0) +
        (statDayInPeriod ? OTStatReg : 0))) *
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
            <TotalLine
              premiumType="Base Pay"
              hoursTotal={baseHoursWorkedInPayPeriod}
              premiumRate={userInfo?.hourlyWage!}
              premiumTotal={(
                baseHoursWorkedInPayPeriod * parseFloat(userInfo?.hourlyWage!)
              ).toFixed(2)}
              bgColor="gray"
            />
            <TotalLine
              premiumType="Levelling"
              hoursTotal={
                (userInfo?.shiftPattern === "Alpha" ? 80 : 77) -
                (baseHoursWorkedInPayPeriod +
                  stiipHours +
                  (statDayInPeriod ? OTStatReg : 0))
              }
              premiumRate={userInfo?.hourlyWage!}
              premiumTotal={(
                ((userInfo?.shiftPattern === "Alpha" ? 80 : 77) -
                  (baseHoursWorkedInPayPeriod +
                    stiipHours +
                    (statDayInPeriod ? OTStatReg : 0))) *
                parseFloat(userInfo?.hourlyWage!)
              ).toFixed(2)}
            />
            <TotalLine
              premiumType="STIIP"
              hoursTotal={stiipHours > 0 ? stiipHours : 0}
              premiumRate={(parseInt(userInfo?.hourlyWage!) * 0.75).toFixed(2)}
              premiumTotal={
                stiipHours > 0
                  ? (parseFloat(userInfo?.hourlyWage!) * 0.75).toFixed(2)
                  : "0.00"
              }
              bgColor="grey"
            />

            <TotalLine
              premiumType="Alpha P"
              hoursTotal={alphaTotal > 0 ? alphaTotal / 3.6 : 0}
              premiumRate="3.60"
              premiumTotal={alphaTotal.toFixed(2)}
            />
            <TotalLine
              premiumType="Night Shift"
              hoursTotal={nightHoursWorked}
              premiumRate="2.00"
              premiumTotal={nightEarnings.toFixed(2)}
              bgColor="gray"
            />
            <TotalLine
              premiumType="Weekend"
              hoursTotal={weekendHours}
              premiumRate="2.25"
              premiumTotal={weekendTotal.toFixed(2)}
            />

            <TotalLine
              premiumType="OT 1.5"
              hoursTotal={OTOnePointFiveHours > 0 ? OTOnePointFiveHours : 0}
              premiumRate={(parseFloat(userInfo?.hourlyWage!) * 1.5).toFixed(2)}
              premiumTotal={
                OTOnePointFiveHours > 0
                  ? (
                      OTOnePointFiveHours *
                      (parseFloat(userInfo?.hourlyWage!) * 1.5)
                    ).toFixed(2)
                  : "0.00"
              }
              bgColor="gray"
            />

            <TotalLine
              premiumType="OT 2.0"
              hoursTotal={OTDoubleTime > 0 ? OTDoubleTime : 0}
              premiumRate={(parseInt(userInfo?.hourlyWage!) * 2.0).toFixed(2)}
              premiumTotal={
                OTDoubleTime > 0
                  ? (
                      OTDoubleTime *
                      (parseFloat(userInfo?.hourlyWage!) * 2.0)
                    ).toFixed(2)
                  : "0.00"
              }
            />

            {statDayInPeriod?.OTStatReg && statDayInPeriod.OTStatReg > 0 && (
              <TotalLine
                premiumType="OTStatReg"
                hoursTotal={OTStatReg}
                premiumRate={(parseInt(userInfo?.hourlyWage!) * 2.0).toFixed(2)}
                premiumTotal={
                  statDayInPeriod.OTStatReg > 0
                    ? (
                        OTStatReg *
                        (parseFloat(userInfo?.hourlyWage!) * 2.0)
                      ).toFixed(2)
                    : "0.00"
                }
                bgColor="gray"
              />
            )}

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

          <View>
            <Text className="text-center text-xl font-bold">
              Total Gross pay
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
                ${biWeeklyEarnings.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
