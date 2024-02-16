import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { format } from "date-fns";
import { Stack, Link, useFocusEffect } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useUserInfo,
  useUserInfoDispatch,
} from "../../context/userInfoContext";
import { DateTime } from "luxon";
import DaySummary from "../../components/DashboardComponents/DaySummary";
import Header from "../../components/DashboardComponents/Header";
import DayOff from "../../components/DashboardComponents/DayOff";
import {
  usePayPeriod,
  usePayPeriodDispatch,
} from "../../context/payPeriodDataContext";
import HeaderGear from "../../components/DashboardComponents/HeaderGear";
import getPayDaysFromServer, {
  getDeductionsFromServer,
} from "../../utils/helpers/serverCalls";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Dashboard() {
  const [grossIncome, setGrossIncome] = useState(0);
  // payDay will be used for render button text as well as tracking which payday in the month is being displayed
  const [payDay, setPayDay] = useState("");
  // payDaysInDisplayedMonth will hold the actual data returned from the server
  const [indexInMonth, setIndexInMonth] = useState(0);

  const userInfo = useUserInfo();
  const payPeriod = usePayPeriod();
  const userInfoDispatch = useUserInfoDispatch();
  const payPeriodDispatch = usePayPeriodDispatch();

  const getMonthAndyearData = async () => {
    try {
      const value = await AsyncStorage.getItem("monthAndYear");
      if (value !== null && userInfoDispatch) {
        userInfoDispatch({
          type: "setPayMonthAndYearToDisplay",
          payload: value,
        });
      }
    } catch (e) {
      console.log("error reading month and year from storage");
    }
  };

  // hook to make api call and fetch current months pay data for user
  useEffect(() => {
    const fetchData = () => {
      if (userInfo && payPeriodDispatch) {
        const today = DateTime.now();
        getPayDaysFromServer(
          userInfo,
          today.month,
          today.year,
          payPeriodDispatch
        );
      }
    };

    // get the paydays and also get the last month and year that was displayed and update it
    fetchData();
    getMonthAndyearData();
  }, [userInfo?.hourlyWage]); // Hourly wage only changes if user edits their data through the profile link

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
        (total, day) => total + (day.OTOnePointFive ? day.OTOnePointFive : 0),
        0
      );

      let OTDoubleTime: number = payPeriod[
        indexInMonth
      ].workDaysInPayPeriod.reduce(
        (total, day) => total + (day.OTDoubleTime ? day.OTDoubleTime : 0),
        0
      );

      let RDayInPeriod = payPeriod[indexInMonth].workDaysInPayPeriod.find(
        (day) => day.rotation === "R Day" || day.rotation === "R Day OT"
      );

      let statDayInPeriod = payPeriod[indexInMonth].workDaysInPayPeriod.find(
        (day) => day.OTStatReg! > 0
      );

      let superStatDaysInPeriod = payPeriod[
        indexInMonth
      ].workDaysInPayPeriod.filter((day) => day.OTSuperStat! > 0);

      let OTStatReg = 0;
      if (statDayInPeriod) {
        OTStatReg = statDayInPeriod.OTStatReg!;
      }

      let OTSuperStat = 0;
      if (superStatDaysInPeriod) {
        OTSuperStat = superStatDaysInPeriod.reduce(
          (total, day) => total + day.OTSuperStat!,
          0
        );
      }

      let sickPaidHours = 0;
      let fullPaidSickDaysInPeriod = payPeriod[
        indexInMonth
      ].workDaysInPayPeriod.filter(
        (day) => day.sickPaidHours && day.sickPaidHours > 0
      );
      if (fullPaidSickDaysInPeriod) {
        sickPaidHours = fullPaidSickDaysInPeriod.reduce(
          (total, day) => total + day.sickPaidHours!,
          0
        );
      }

      gross =
        // add 8.29 due to the uniform allowance every pay period and send it to the backend, backend calculations automatically minus 8.29 in the calculations and users Pay Stubs will include this 8.29 figure in the gross totals
        gross +
        ((userInfo?.shiftPattern === "Alpha" ? 80 : 77) -
          (baseHoursWorkedInPayPeriod +
            stiipHours +
            sickPaidHours +
            (RDayInPeriod ? 12 : 0) +
            (statDayInPeriod ? OTStatReg : 0) +
            (superStatDaysInPeriod ? OTSuperStat : 0))) *
          parseFloat(userInfo?.hourlyWage!) +
        8.29;

      let level =
        baseHoursWorkedInPayPeriod +
        stiipHours +
        sickPaidHours +
        (statDayInPeriod ? OTStatReg : 0) +
        (superStatDaysInPeriod ? OTSuperStat : 0);

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
        OTStatReg,
        OTSuperStat,
        userInfo!,
        payPeriod,
        indexInMonth,
        payPeriodDispatch!
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

      getPayDaysFromServer(
        userInfo,
        monthNumber,
        parseInt(requestedYear!),
        payPeriodDispatch
      );
      setIndexInMonth(0);
    }
  }, [userInfo?.payMonthAndYearToDisplay]);

  useEffect(() => {
    if (payPeriod![indexInMonth].payDay !== payDay) {
      setPayDay(payPeriod![0].payDay);
    }
  }, [payPeriod]);

  useEffect(() => {
    getMonthAndyearData();
  }, []);

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
