import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import { Stack, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserInfo } from "../context/userInfoContext";
import {
  getPayPeriodStart,
  getPayPeriodSchedule,
} from "../utils/ScheduleUtils";
import {
  generateStartTimeDate,
  generateEndTimeDate,
  getHoursWorked,
  getNightShiftPremiumHoursWorked,
  getWeekendPremiumHoursWorked,
} from "../utils/HourAndMoneyUtils";
import { IScheduleItem } from "../interfaces/IPlatoonStart";
import DaySummary from "../components/DashboardComponents/DaySummary";
import DayOff from "../components/DashboardComponents/DayOff";

export default function Dashboard() {
  const [payPeriodSchedule, setPayPeriodSchedule] = useState<IScheduleItem[]>();
  const userInfo = useUserInfo();

  useEffect(() => {
    const payPeriodStart = getPayPeriodStart(userInfo?.payDay!);
    const payPeriodSchedule = getPayPeriodSchedule(
      payPeriodStart,
      userInfo?.platoon!
    );
    setPayPeriodSchedule(payPeriodSchedule);
  }, []);
  return (
    <SafeAreaView
      style={{ flex: 1, flexDirection: "column", alignItems: "center" }}
    >
      <Stack.Screen
        options={{
          headerBackTitleVisible: false,
          headerStyle: { backgroundColor: "#379D9F" },
        }}
      />

      <View>
        <View className="mt-9 py-4 bg-[#379D9F] w-screen flex flex-row justify-evenly">
          <Button mode="contained" onPress={() => console.log("Pressed")}>
            First Half
          </Button>
          <Button mode="contained" onPress={() => console.log("Pressed")}>
            Second Half
          </Button>
        </View>
        <ScrollView
          style={{
            display: "flex",
            flexDirection: "column",
          }}
          contentContainerStyle={{ alignItems: "center" }}
          className="space-y-3 pt-4"
        >
          {payPeriodSchedule &&
            payPeriodSchedule.map((item, i) => {
              const shiftStart = generateStartTimeDate(item, userInfo!);
              const shiftEnd = generateEndTimeDate(item, userInfo!);

              const baseHoursWorked = getHoursWorked(shiftStart, shiftEnd);
              const nightShiftHoursWorked = getNightShiftPremiumHoursWorked(
                shiftStart,
                shiftEnd
              );
              const weekendHoursWorked = getWeekendPremiumHoursWorked(
                shiftStart,
                shiftEnd
              );

              let baseRate = userInfo?.hourlyWage;
              let nightShiftPremium =
                userInfo!.shiftPattern === "Alpha" ? 5.6 : 2.0;
              let weekendPremium = 2.25;
              let total =
                parseInt(baseRate!) * baseHoursWorked +
                nightShiftHoursWorked * nightShiftPremium +
                weekendPremium * weekendHoursWorked;
              if (item.rotation === "day off") {
                total = 0;
              }
              console.log("rotation: " + item.rotation + " Date: " + item.date);
              return (
                <View className="flex w-5/6" key={i}>
                  {item.rotation === "day off" ? (
                    <DayOff date={item.date} />
                  ) : (
                    <DaySummary
                      DayOrNight={item.rotation}
                      Date={item.date}
                      TotalForDay={total.toString()}
                      BaseHoursWorked={baseHoursWorked}
                      NightHoursWorked={nightShiftHoursWorked}
                      WeekendHoursWorked={weekendHoursWorked}
                      baseRate={baseRate!}
                      shiftStart={shiftStart}
                      shiftEnd={shiftEnd}
                      index={i}
                    />
                  )}
                </View>
              );
            })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
