import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { format } from "date-fns";
import { Stack, Link, router } from "expo-router";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserInfo, useUserInfoDispatch } from "../context/userInfoContext";
import {
  generateFullYearsPayDaysForUserInfo,
  getNextPayday,
  generatePaydays,
} from "../utils/ScheduleUtils";

import DaySummary from "../components/DashboardComponents/DaySummary";
import Header from "../components/DashboardComponents/Header";
import DayOff from "../components/DashboardComponents/DayOff";
import { ITwoWeekPayPeriod } from "../interfaces/IAppState";

export default function Dashboard() {
  const [grossIncome, setGrossIncome] = useState(0);
  const [payDay, setPayDay] = useState("");
  const [payDaysInDisplayedMonth, setPayDaysInDisplayedMonth] = useState<
    string[]
  >([]);

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
    if (userInfo && userInfo.payDaysForYear && dispatch) {
      let today = new Date();
      let payDays = generatePaydays(new Date(2023, 10, 3), 32);
      let nextPayday = getNextPayday(today, payDays);
      const currentMonth = nextPayday!.toLocaleString("default", {
        month: "long",
      });
      const currentYear = nextPayday!.toLocaleString("default", {
        year: "numeric",
      });
      // update displayed month/year in context so header and payday buttons are not null
      dispatch({
        type: "setPayMonthAndYearToDisplay",
        payload: `${currentMonth} ${currentYear}`,
      });

      if (nextPayday && userInfo.payDaysForYear[nextPayday.toISOString()]) {
        setPayDay(nextPayday.toISOString());

        setGrossIncome(
          userInfo.payDaysForYear[nextPayday.toISOString()].totalEarnings
        );
      }
    }
  }, [userInfo!.payDaysForYear]);

  useEffect(() => {
    // anytime payDay changes dispatch an update to update the header component with the correct month
    if (payDay) {
      if (dispatch) {
        dispatch({
          type: "setPaydayToDisplay",
          payload: payDay,
        });
      }

      setGrossIncome(userInfo?.payDaysForYear![payDay].totalEarnings!);
    }
  }, [payDay]);

  // anytime the paymonth to display changes, rerender the dashboard with the new corresponding pay period from the userInfoObject
  useEffect(() => {
    if (userInfo?.payMonthAndYearToDisplay) {
      const [selectedMonth, selectedYear] =
        userInfo.payMonthAndYearToDisplay.split(" ");

      const matchingPayDay = Object.entries(userInfo.payDaysForYear!).find(
        ([payDay]) => {
          const date = new Date(payDay);
          const month = date.toLocaleString("default", { month: "long" });
          const year = date.toLocaleString("default", { year: "numeric" });

          return month === selectedMonth && year === selectedYear;
        }
      );

      // loop over all the paydays for the year and look for the entries that match both the selected month and year for the context variable payMonthAndYearToDisplay, and return an array of just those dates
      if (userInfo.payDaysForYear) {
        const payDaysInMonth = Object.keys(userInfo.payDaysForYear!).filter(
          (payDay) => {
            const date = new Date(payDay);
            const month = date.toLocaleString("default", { month: "long" });
            const year = date.toLocaleString("default", { year: "numeric" });

            return month === selectedMonth && year === selectedYear;
          }
        );
        setPayDaysInDisplayedMonth(payDaysInMonth);
      }

      if (matchingPayDay) {
        const [payDay, payPeriod] = matchingPayDay;
        setGrossIncome(payPeriod.totalEarnings);
        setPayDay(payDay);
      }
    }
  }, [userInfo?.payMonthAndYearToDisplay, userInfo?.payDaysForYear]);

  return (
    <SafeAreaView
      style={{ flex: 1, flexDirection: "column", alignItems: "center" }}
    >
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#379D9F" },
          headerShown: true,
          headerTitle: () => {
            return <Header />;
          },
          headerBackVisible: false,
          headerRight: () => {
            return (
              <MaterialIcons
                name="settings"
                onPress={() => router.back()}
                size={24}
                color={"white"}
              />
            );
          },
        }}
      />

      <View>
        <View className="pt-12 pb-4 bg-[#379D9F] w-screen flex flex-row justify-evenly">
          <View className="rounded-2xl bg-[#45abad] flex flex-row">
            {payDaysInDisplayedMonth &&
              payDaysInDisplayedMonth.map((p, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    className={`rounded-full bg-white p-3 ${
                      p === payDay ? "bg-white" : "bg-[#45abad]"
                    }`}
                    onPress={() => {
                      setPayDay(p);
                    }}
                  >
                    <Text
                      className={`font-bold ${
                        p === payDay ? " text-[#379D9F]" : "text-white"
                      }`}
                    >
                      {format(new Date(p), "PP")}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
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
          {userInfo?.payDaysForYear &&
            userInfo.payDaysForYear[payDay] &&
            userInfo.payDaysForYear[payDay].payDaysInPayPeriod &&
            userInfo.payDaysForYear[payDay].payDaysInPayPeriod.map(
              (singleDay, i) => {
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
              }
            )}
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
