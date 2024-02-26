import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Link } from "expo-router";
import {
  useUserInfo,
  useUserInfoDispatch,
} from "../../context/userInfoContext";
import { usePayPeriod } from "../../context/payPeriodDataContext";

export default function Header({ indexInMonth }: { indexInMonth: number }) {
  const [month, setMonth] = useState("");
  const userInfo = useUserInfo();
  const payPeriod = usePayPeriod();

  useEffect(() => {
    if (payPeriod) {
      let dateToDisplay = new Date(payPeriod[indexInMonth].payDay);
      let month = dateToDisplay.toLocaleString("default", { month: "long" });
      setMonth(month);
    }
  }, []);

  useEffect(() => {
    setMonth(userInfo?.payMonthAndYearToDisplay?.split(" ")[0]!);
  }, [userInfo?.payMonthAndYearToDisplay]);

  return (
    <View>
      {month && (
        <SafeAreaView
          style={{ backgroundColor: "#379D9F", alignItems: "center" }}
          className="flex flex-row"
        >
          <Link href={"/monthModal"} asChild>
            <Pressable
              className="flex flex-row"
              style={{ alignItems: "center" }}
            >
              <Text className="text-2xl font-bold text-white text-center px-2">
                {month}
              </Text>
              <AntDesign name="down" size={18} color={"white"} />
            </Pressable>
          </Link>
        </SafeAreaView>
      )}
    </View>
  );
}
