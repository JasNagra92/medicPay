import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams } from "expo-router";
import { ImageBackground, View, Text } from "react-native";
import { useUserInfo } from "../context/userInfoContext";
import TotalLine from "../components/FinalTotalComponents/TotalLine";

const image = require("../assets/images/bgImage.png");

export default function FinalTotal() {
  const { payDay } = useLocalSearchParams();
  const userInfo = useUserInfo();
  const userInfoData = userInfo!.payDaysForYear![payDay as string] || {};

  const {
    baseHoursWorkedInPayPeriod: baseHoursTotal,
    baseTotalEarnings,
    alphaHoursWorkedInPayPeriod: alphaHoursWorked,
    alphaNightTotalEarnings: alphaTotal,
    nightHoursWorkedInPayPeriod: nightHoursWorked,
    nightShiftTotalEarnings: nightTotal,
    weekendHoursWorkedInPayPeriod: weekendHours,
    weekendTotalEarnings: weekendTotal,
  } = userInfoData;

  return (
    <ImageBackground source={image} style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            shadowColor: "rgba(0, 0, 0, 0.25)",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowRadius: 25,
            shadowOpacity: 1,
          }}
          className="rounded-2xl bg-white shadow-sm h-5/6 w-5/6 border-0 p-3 flex flex-col justify-around"
        >
          <View>
            <Text className="text-center font-bold text-lg">Final Total</Text>
          </View>

          <View className="flex flex-col justify-evenly">
            <TotalLine
              premiumType="Base Pay"
              hoursTotal={baseHoursTotal!}
              premiumRate={userInfo?.hourlyWage!}
              premiumTotal={baseTotalEarnings?.toFixed(2)!}
            />
            <TotalLine
              premiumType="Alpha P"
              hoursTotal={alphaHoursWorked}
              premiumRate="3.60"
              premiumTotal={alphaTotal.toFixed(2)}
              bgColor="grey"
            />
            <TotalLine
              premiumType="Night Shift"
              hoursTotal={nightHoursWorked}
              premiumRate="2.00"
              premiumTotal={nightTotal.toFixed(2)}
            />
            <TotalLine
              premiumType="Weekend"
              hoursTotal={weekendHours}
              premiumRate="2.00"
              premiumTotal={weekendTotal.toFixed(2)}
              bgColor="gray"
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
