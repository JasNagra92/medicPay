import React, { useState, useEffect, useCallback } from "react";
import { useAuthentication } from "../../utils/hooks/useAuthentication";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { format } from "date-fns";
import { Stack, Link, router, Redirect } from "expo-router";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserInfo } from "../../context/userInfoContext";
import { DateTime } from "luxon";
import axiosInstance from "../../utils/helpers/axiosInstance";

import DaySummary from "../../components/DashboardComponents/DaySummary";
import Header from "../../components/DashboardComponents/Header";
import DayOff from "../../components/DashboardComponents/DayOff";
import { IPayPeriodData, IUserInfo } from "../../interfaces/IAppState";
import {
  usePayPeriod,
  usePayPeriodDispatch,
} from "../../context/payPeriodDataContext";

export default function Dashboard() {
  const { user } = useAuthentication();
  // if (!user) {
  //   Redirect({ href: "/login" });
  // }
  const [grossIncome, setGrossIncome] = useState(0);
  // payDay will be used for render button text as well as tracking which payday in the month is being displayed
  const [payDay, setPayDay] = useState("");
  // payDaysInDisplayedMonth will hold the actual data returned from the server
  const [payDaysInDisplayedMonth, setPayDaysInDisplayedMonth] = useState<
    IPayPeriodData[] | null
  >(null);

  const userInfo = useUserInfo();
  const payPeriod = usePayPeriod();
  const payPeriodDispatch = usePayPeriodDispatch();

  const getPayDaysFromServer = async (
    userInfo: IUserInfo,
    month: number,
    year: number
  ) => {
    try {
      // get the paydays for the current month and year and set them in state for the buttons to display correctly
      let response = await axiosInstance.post("/getPayData", {
        userInfo,
        month,
        year,
      });
      setPayDaysInDisplayedMonth(response.data.data);
      if (payPeriodDispatch) {
        payPeriodDispatch({
          type: "setPayPeriod",
          payload: response.data.data[0],
        });
      }
      setPayDay(response.data.data[0].payDay);
    } catch (error) {
      console.log(error);
    }
  };

  // hook to make api call and fetch current months pay data for user
  useEffect(() => {
    if (userInfo && payPeriodDispatch) {
      const today = DateTime.now();

      getPayDaysFromServer(userInfo, today.month, today.year);
    }
  }, []);

  // hook to update the gross income whenever the payday data in context changes
  useEffect(() => {
    if (payPeriod) {
      setGrossIncome(
        payPeriod.workDaysInPayPeriod.reduce(
          (total, day) => total + day.dayTotal,
          0
        )
      );
    }
  }, [payPeriod]);

  useEffect(() => {
    // change the displayed payday data whenever the payDay changes from a user button press
    if (payDaysInDisplayedMonth && payPeriodDispatch) {
      let newPayday = payDaysInDisplayedMonth!.find(
        (dayInMonth) => dayInMonth.payDay === payDay
      );
      payPeriodDispatch({ type: "setPayPeriod", payload: newPayday! });
    }
  }, [payDay]);

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
                      p.payDay === payDay ? "bg-white" : "bg-[#45abad]"
                    }`}
                    onPress={() => {
                      setPayDay(p.payDay);
                    }}
                  >
                    <Text
                      className={`font-bold ${
                        p.payDay === payDay ? " text-[#379D9F]" : "text-white"
                      }`}
                    >
                      {format(new Date(p.payDay), "PP")}
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
          {payPeriod?.workDaysInPayPeriod &&
            payPeriod.workDaysInPayPeriod.map((singleDay, i) => {
              if (singleDay.rotation === "day off") {
                return (
                  <View className="flex w-5/6" key={i}>
                    <DayOff date={singleDay.date} />
                  </View>
                );
              } else {
                return (
                  <View className="flex w-5/6" key={i}>
                    <DaySummary {...singleDay} index={i} />
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
