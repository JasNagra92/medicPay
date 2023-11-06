import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams } from "expo-router";
import { ImageBackground, View, Text } from "react-native";
import { useUserInfo } from "../context/userInfoContext";
import TotalLine from "../components/FinalTotalComponents/TotalLine";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";

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
    totalEarnings,
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
          className="rounded-2xl bg-white shadow-sm h-5/6 w-5/6 border-0 p-3 flex flex-col justify-evenly"
        >
          <View className="flex flex-col justify-between">
            <View className="p-5">
              <Text className="text-3xl text-center font-semibold underline decoration-[#379D9F]">
                Final Total
              </Text>
            </View>
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
            <TotalLine
              premiumType="STIIP"
              hoursTotal={0}
              premiumRate={(parseInt(userInfo?.hourlyWage!) * 0.75).toFixed(2)}
              premiumTotal={0.0}
            />
            <TotalLine
              premiumType="OT 1.5"
              hoursTotal={0}
              premiumRate={(parseInt(userInfo?.hourlyWage!) * 1.5).toFixed(2)}
              premiumTotal={0.0}
              bgColor="gray"
            />
            <TotalLine
              premiumType="OT 2.0"
              hoursTotal={0}
              premiumRate={(parseInt(userInfo?.hourlyWage!) * 2.0).toFixed(2)}
              premiumTotal={0.0}
            />
            <View className="py-7">
              <View
                style={{
                  borderBottomColor: "#D9D9D9",
                  borderBottomWidth: 2,
                  width: "100%",
                }}
              ></View>
            </View>
          </View>
          <View>
            <Text className="text-center text-xl font-semi-bold">
              Total Gross pay
            </Text>
            <View
              className="flex flex-row justify-center "
              style={{ alignItems: "center" }}
            >
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={24}
                color="#379D9F"
              />
              <Text className="text-[#379D9F]">
                {format(new Date(payDay as string), "PP")}{" "}
              </Text>
            </View>
            <View className="flex flex-row justify-center py-2">
              <Text className="text-3xl font-extrabold">
                ${totalEarnings.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
