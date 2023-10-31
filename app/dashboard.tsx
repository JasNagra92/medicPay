import React, { useState, useEffect } from "react";
import { Text, View, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import { Stack, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserInfo } from "../context/userInfoContext";
import {
  getPayPeriodStart,
  getPayPeriodSchedule,
} from "../utils/ScheduleUtils";
import {
  calculateEarnings,
  generateStartTimeDate,
  generateEndTimeDate,
} from "../utils/HourAndMoneyUtils";
import { IScheduleItem } from "../interfaces/IPlatoonStart";
import DaySummary from "../components/DashboardComponents/DaySummary";

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
          className="space-y-3 mt-4"
        >
          {payPeriodSchedule &&
            payPeriodSchedule.map((item, i) => {
              const shiftStart = generateStartTimeDate(item, userInfo!);
              const shiftEnd = generateEndTimeDate(item, userInfo!);
              let baseRate = 43.13;
              let nightShiftPremium = 5.25;
              let weekendPremium = 2.5;
              let total = calculateEarnings(
                shiftStart,
                shiftEnd,
                baseRate,
                nightShiftPremium,
                weekendPremium
              );
              if (item.rotation === "day off") {
                total = "0";
              }
              return (
                <View className="flex w-5/6">
                  <DaySummary
                    DayOrNight="Day"
                    Date={item.date}
                    TotalForDay={total}
                    BaseHoursWorked={12}
                  />
                </View>
              );
            })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
