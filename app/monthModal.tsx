import { ScrollView, ImageBackground } from "react-native";
import { Link, router } from "expo-router";
import MonthDisplay from "../components/MonthModalComponents/MonthDisplay";
import { StatusBar } from "expo-status-bar";
import { useUserInfo, useUserInfoDispatch } from "../context/userInfoContext";
const image = require("../assets/images/bgImage.png");

export default function MonthModal() {
  const userInfo = useUserInfo();
  const dispatch = useUserInfoDispatch();

  const renderUniqueMonthDisplays = () => {
    const uniqueMonths = new Set<string>();

    Object.keys(userInfo!.payDaysForYear!).forEach((payDayISO) => {
      const date = new Date(payDayISO);
      const monthAndYear = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      uniqueMonths.add(monthAndYear);
    });

    const uniqueMonthArray = Array.from(uniqueMonths).map(
      (monthAndYear, index) => (
        <MonthDisplay key={index} monthAndYear={monthAndYear} />
      )
    );

    return uniqueMonthArray;
  };

  return (
    <ImageBackground source={image} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          paddingBottom: 300,
          padding: 30,
          gap: 40,
          alignItems: "center",
        }}
      >
        {userInfo?.payDaysForYear && renderUniqueMonthDisplays()}
        <StatusBar style="light" />
      </ScrollView>
    </ImageBackground>
  );
}
