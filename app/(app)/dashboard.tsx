import React, { useState, useEffect } from "react";
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
import { IUserInfo } from "../../interfaces/IAppState";
import {
  usePayPeriod,
  usePayPeriodDispatch,
} from "../../context/payPeriodDataContext";
import { AuthStore } from "../../store";

export default function Dashboard() {
  // const { initialized, isLoggedIn } = AuthStore.useState();

  // if (initialized && !isLoggedIn) {
  //   Redirect({ href: "/login" });
  // }

  const [grossIncome, setGrossIncome] = useState(0);
  // payDay will be used for render button text as well as tracking which payday in the month is being displayed
  const [payDay, setPayDay] = useState("");
  // payDaysInDisplayedMonth will hold the actual data returned from the server
  const [indexInMonth, setIndexInMonth] = useState(0);

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
      if (payPeriodDispatch) {
        payPeriodDispatch({
          type: "setPayPeriod",
          payload: response.data.data,
        });
        setPayDay(response.data.data[0].payDay);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDeductionsFromServer = async (
    gross: number,
    incomeLessLevelling: number,
    stiipHours: number,
    OTOnePointFive: number,
    OTDoubleTime: number,
    OTStatReg: number
  ) => {
    try {
      let response = await axiosInstance.post("/getDeductions", {
        userInfo,
        grossIncome: gross,
        stiipHours,
        incomeLessLevelling,
        OTOnePointFive:
          OTOnePointFive * (parseFloat(userInfo?.hourlyWage!) * 1.5),
        OTDoubleTime: OTDoubleTime * (parseFloat(userInfo?.hourlyWage!) * 2.0),
        payDay: DateTime.fromISO(payPeriod![indexInMonth].payDay).toISODate(),
        OTStatReg,
      });
      const { ei, incomeTax, cpp, pserp, unionDues, netIncome } =
        response.data.data;
      // console.log(response.data.data);
      if (payPeriodDispatch) {
        payPeriodDispatch({
          type: "updateDeductions",
          payload: {
            indexInMonth,
            ei,
            incomeTax,
            cpp,
            pserp,
            unionDues,
            netIncome,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // hook to make api call and fetch current months pay data for user
  useEffect(() => {
    if (userInfo && payPeriodDispatch) {
      const today = DateTime.fromISO("2024-01-01");

      getPayDaysFromServer(userInfo, today.month, today.year);
    }
  }, []);

  // hook to update the gross income and the net income whenever the payday data in context changes
  useEffect(() => {
    if (payPeriod) {
      let baseHoursWorkedInPayPeriod = payPeriod[
        indexInMonth
      ].workDaysInPayPeriod.reduce(
        (total, day) => total + day.baseHoursWorked,
        0
      );

      let stiipHours = payPeriod[indexInMonth].workDaysInPayPeriod.reduce(
        (total, day) => total + (day.stiipHours ? day.stiipHours : 0),
        0
      );

      let gross = payPeriod[indexInMonth].workDaysInPayPeriod.reduce(
        (total, day) => total + day.dayTotal,
        0
      );

      let OTOnePointFive: number = payPeriod[
        indexInMonth
      ].workDaysInPayPeriod.reduce(
        (total, day) => total + (day.OTOnePointFive ? OTOnePointFive : 0),
        0
      );
      let OTDoubleTime: number = payPeriod[
        indexInMonth
      ].workDaysInPayPeriod.reduce(
        (total, day) => total + (day.OTDoubleTime ? OTDoubleTime : 0),
        0
      );

      let RDayInPeriod = payPeriod[indexInMonth].workDaysInPayPeriod.find(
        (day) => day.rotation === "R Day" || day.rotation === "R Day OT"
      );

      let statDayInPeriod = payPeriod[indexInMonth].workDaysInPayPeriod.find(
        (day) => day.OTStatReg! > 0
      );
      let OTStatReg = 0;
      if (statDayInPeriod) {
        OTStatReg = statDayInPeriod.OTStatReg!;
      }

      gross =
        // add 8.29 due to the uniform allowance every pay period and send it to the backend, backend calculations automatically minus 8.29 in the calculations and users Pay Stubs will include this 8.29 figure in the gross totals
        gross +
        ((userInfo?.shiftPattern === "Alpha" ? 80 : 77) -
          (baseHoursWorkedInPayPeriod +
            stiipHours +
            (RDayInPeriod ? 12 : 0) +
            (statDayInPeriod ? OTStatReg : 0))) *
          parseFloat(userInfo?.hourlyWage!) +
        8.29;

      let level =
        baseHoursWorkedInPayPeriod +
        stiipHours +
        (statDayInPeriod ? OTStatReg : 0);

      let levelledWage =
        ((userInfo?.shiftPattern === "Alpha" ? 80 : 77) - level) *
        parseFloat(userInfo?.hourlyWage!);

      let incomeLessLevelling = gross - levelledWage - 8.29;

      setGrossIncome(gross);

      getDeductionsFromServer(
        gross,
        incomeLessLevelling,
        stiipHours,
        OTOnePointFive,
        OTDoubleTime,
        OTStatReg
      );
    }
  }, [payDay, payPeriod![indexInMonth].workDaysInPayPeriod]);

  // effect to fetch a new month and years pay data whenever the dispatch function in the month picker modal changes the month and year the user is wanting to be displayed
  useEffect(() => {
    if (userInfo && payPeriodDispatch) {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const requestedMonthName =
        userInfo.payMonthAndYearToDisplay?.split(" ")[0];
      const monthNumber = monthNames.indexOf(requestedMonthName!) + 1;
      const requestedYear = userInfo.payMonthAndYearToDisplay?.split(" ")[1];

      getPayDaysFromServer(userInfo, monthNumber, parseInt(requestedYear!));
      setIndexInMonth(0);
    }
  }, [userInfo?.payMonthAndYearToDisplay]);

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
            href={{ pathname: "/FinalTotal", params: { indexInMonth } }}
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
