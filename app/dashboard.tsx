import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { Button } from "react-native-paper";
import { Stack, Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserInfo, useUserInfoDispatch } from "../context/userInfoContext";
import {
  generateFullYearsPayDaysForUserInfo,
  getNextPayday,
  generatePaydays,
} from "../utils/ScheduleUtils";

import DaySummary from "../components/DashboardComponents/DaySummary";
import DayOff from "../components/DashboardComponents/DayOff";
import { ISingleDaysPayData, ITwoWeekPayPeriod } from "../interfaces/IAppState";

export default function Dashboard() {
  const [payPeriodSchedule, setPayPeriodSchedule] =
    useState<ISingleDaysPayData[]>();
  const [grossIncome, setGrossIncome] = useState(0);
  const [payDay, setPayDay] = useState("");

  const userInfo = useUserInfo();
  const dispatch = useUserInfoDispatch();

  useEffect(() => {
    const payDaysForYear: Record<string, ITwoWeekPayPeriod> =
      generateFullYearsPayDaysForUserInfo(userInfo!);
    if (dispatch) {
      dispatch({ type: "SET_PAY_DAYS_FOR_YEAR", payload: payDaysForYear });
    }
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.payDaysForYear) {
      let today = new Date();
      let payDays = generatePaydays(new Date(2023, 10, 3), 32);
      let nextPayday = getNextPayday(today, payDays);

      if (nextPayday && userInfo.payDaysForYear[nextPayday.toISOString()]) {
        let currentPayPeriod =
          userInfo.payDaysForYear[nextPayday.toISOString()].payDaysInPayPeriod;
        setPayPeriodSchedule(currentPayPeriod);
        setPayDay(nextPayday.toISOString());
        setGrossIncome(
          userInfo.payDaysForYear[nextPayday.toISOString()].totalEarnings
        );
      }
    }
  }, [userInfo]);

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
            payPeriodSchedule.map((singleDay, i) => {
              if (singleDay.rotation === "day off") {
                return (
                  <View className="flex w-5/6" key={i}>
                    <DayOff date={singleDay.day} />
                  </View>
                );
              } else {
                return (
                  <View className="flex w-5/6" key={i}>
                    <DaySummary {...singleDay} />
                  </View>
                );
              }
            })}
        </ScrollView>
        <View className="flex flex-row justify-center">
          <Link
            href={{ pathname: "/FinalTotal", params: { payDay: payDay } }}
            asChild
          >
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
