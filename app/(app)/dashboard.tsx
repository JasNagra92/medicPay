import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { Stack, Link } from "expo-router";
import { calculatePayData } from "../../utils/helpers/dashboardHelpers";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserInfo } from "../../context/userInfoContext";
import DaySummary from "../../components/DashboardComponents/DaySummary";
import Header from "../../components/DashboardComponents/Header";
import DayOff from "../../components/DashboardComponents/DayOff";
import {
  usePayPeriod,
  usePayPeriodDispatch,
} from "../../context/payPeriodDataContext";
import HeaderGear from "../../components/DashboardComponents/HeaderGear";
import { getDeductionsFromServer } from "../../utils/helpers/serverCalls";
import { DateTime } from "luxon";

export default function Dashboard() {
  const [grossIncome, setGrossIncome] = useState(0);
  // payDay will be used for render button text as well as tracking which payday in the month is being displayed
  const [payDay, setPayDay] = useState("");
  // payDaysInDisplayedMonth will hold the actual data returned from the server
  const [indexInMonth, setIndexInMonth] = useState(0);

  const userInfo = useUserInfo();
  const payPeriod = usePayPeriod();
  const payPeriodDispatch = usePayPeriodDispatch();

  // hook to update the gross income and the net income whenever the payday data in context changes
  useEffect(() => {
    if (payPeriod && userInfo) {
      let {
        gross,
        incomeLessLevelling,
        stiipHours,
        OTOnePointFive,
        OTDoubleTime,
        OTStatReg,
        OTSuperStat,
      } = calculatePayData(payPeriod, indexInMonth, userInfo);

      setGrossIncome(gross);

      getDeductionsFromServer(
        gross,
        incomeLessLevelling,
        stiipHours,
        OTOnePointFive,
        OTDoubleTime,
        OTStatReg,
        OTSuperStat,
        userInfo!,
        payPeriod,
        indexInMonth,
        payPeriodDispatch!
      );
    }
  }, [payPeriod, indexInMonth]);

  useEffect(() => {
    if (payPeriod![indexInMonth].payDay !== payDay) {
      setPayDay(payPeriod![0].payDay);
    }
  }, [payPeriod]);

  return (
    <SafeAreaView
      style={{ flex: 1, flexDirection: "column", alignItems: "center" }}
    >
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#379D9F" },
          headerShown: true,
          headerTitle: () => {
            return <Header indexInMonth={indexInMonth} />;
          },
          headerBackVisible: false,
          headerRight: () => {
            return <HeaderGear />;
          },
        }}
      />

      <View>
        <View className="pt-12 pb-4 bg-[#379D9F] w-screen flex flex-row justify-evenly">
          <View className="rounded-2xl bg-[#45abad] flex flex-row">
            {payPeriod &&
              payPeriod.map((p, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    className={`rounded-full bg-white p-3 ${
                      p.payDay === payDay ? "bg-white" : "bg-[#45abad]"
                    }`}
                    onPress={() => {
                      setPayDay(p.payDay);
                      setIndexInMonth(index);
                    }}
                  >
                    <Text
                      className={`font-bold ${
                        p.payDay === payDay ? " text-[#379D9F]" : "text-white"
                      }`}
                    >
                      {DateTime.fromISO(p.payDay).setZone("UTC").toFormat("DD")}
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
          {payPeriod![indexInMonth].workDaysInPayPeriod &&
            payPeriod![indexInMonth].workDaysInPayPeriod.map((singleDay, i) => {
              if (singleDay.rotation === "day off") {
                return (
                  <View className="flex w-5/6" key={i}>
                    <DayOff
                      {...singleDay}
                      index={i}
                      indexInMonth={indexInMonth}
                    />
                  </View>
                );
              } else {
                return (
                  <View className="flex w-5/6" key={i}>
                    <DaySummary
                      {...singleDay}
                      index={i}
                      indexInMonth={indexInMonth}
                    />
                  </View>
                );
              }
            })}
        </ScrollView>
        <View className="flex flex-row justify-center">
          <Link
            href={{
              pathname: "/FinalTotal",
              params: { indexInMonth },
            }}
            asChild
          >
            <TouchableOpacity className="rounded-2xl px-3 py-2 justify-between bg-[#379D9F] flex flex-row shadow-lg w-5/6">
              <View className="flex flex-row">
                <View>
                  <Text className="text-white">Gross Income</Text>
                  <Text className=" text-white font-['General text-lg font-bold leading-[normal]">
                    ${grossIncome.toFixed(2)}
                  </Text>
                </View>
                <View className="pl-3">
                  <Text className="text-white">Net Income</Text>
                  <Text className=" text-white font-['General text-lg font-bold leading-[normal]">
                    $
                    {payPeriod &&
                      payPeriod[indexInMonth].netIncome &&
                      payPeriod[indexInMonth].netIncome}
                  </Text>
                </View>
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
