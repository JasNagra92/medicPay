import React, { useState, useEffect } from "react";
import { Text, ImageBackground, View } from "react-native";
import { Link } from "expo-router";
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

const image = require("../assets/images/bgImage.png");

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
    <ImageBackground source={image} style={{ flex: 1 }}>
      <SafeAreaView
        style={{ flex: 1, flexDirection: "column", alignItems: "center" }}
      >
        <View>
          <Text className="text-center">test routes</Text>
        </View>
        <View>
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
                <View key={i}>
                  <Text>{item.rotation + " " + total}</Text>
                </View>
              );
            })}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
