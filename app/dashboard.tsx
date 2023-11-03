import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { Button } from "react-native-paper";
import { Stack, Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserInfo } from "../context/userInfoContext";
import {
  getPayPeriodStart,
  getPayPeriodSchedule,
  generatePaydaysForYear,
} from "../utils/ScheduleUtils";
import {
  calculateDaySummaryProps,
  calculateTotal,
  calculateFinalTotalProps,
} from "../utils/HourAndMoneyUtils";
import { IScheduleItem } from "../interfaces/IPlatoonStart";
import DaySummary from "../components/DashboardComponents/DaySummary";
import DayOff from "../components/DashboardComponents/DayOff";

export default function Dashboard() {
  const [payPeriodSchedule, setPayPeriodSchedule] = useState<IScheduleItem[]>();
  const [grossIncome, setGrossIncome] = useState(0);
  const userInfo = useUserInfo();

  useEffect(() => {
    console.log(userInfo?.payDay);
    const payPeriodStart = getPayPeriodStart(userInfo?.payDay!);
    const returnedSchedule = getPayPeriodSchedule(
      payPeriodStart,
      userInfo?.platoon!
    );
    setPayPeriodSchedule(returnedSchedule);

    let totalEarnings: number = 0;
    let totalBaseHours: number = 0;
    let totalNightShiftHours: number = 0;
    let totalWeekendHours: number = 0;
    for (const item of returnedSchedule) {
      const { baseHoursWorked, nightShiftHoursWorked, weekendHoursWorked } =
        calculateFinalTotalProps(item, userInfo!);

      totalBaseHours += baseHoursWorked;
      totalNightShiftHours += nightShiftHoursWorked;
      totalWeekendHours += weekendHoursWorked;
      totalEarnings += calculateTotal(item, userInfo!);
    }
    setGrossIncome(totalEarnings);
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
            flex: 1,
          }}
          contentContainerStyle={{ alignItems: "center", paddingBottom: 100 }}
          className="space-y-3 pt-4"
        >
          {payPeriodSchedule &&
            payPeriodSchedule.map((item, i) => {
              if (item.rotation === "day off") {
                return (
                  <View className="flex w-5/6" key={i}>
                    <DayOff date={item.date} />
                  </View>
                );
              } else {
                const props = calculateDaySummaryProps(item, userInfo!);

                return (
                  <View className="flex w-5/6" key={i}>
                    <DaySummary {...props} />
                  </View>
                );
              }
            })}
        </ScrollView>
        <View className="flex flex-row justify-center">
          <Link href="/FinalTotal" asChild>
            <TouchableOpacity className="rounded-2xl px-3 py-2 justify-between bg-[#379D9F] flex flex-row shadow-lg w-5/6">
              <View>
                <Text className="text-white">Gross Income</Text>
                <Text className=" text-white font-['General text-lg font-bold leading-[normal]">
                  ${grossIncome.toFixed(2)}
                </Text>
              </View>
              <View className="flex flex-row items-center">
                <Text className="text-white font-semibold">Overview</Text>
                <AntDesign name="right" color="white" size={16} />
              </View>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
