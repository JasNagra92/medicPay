import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Link } from "expo-router";
import {
  useUserInfo,
  useUserInfoDispatch,
} from "../../context/userInfoContext";

export default function Header() {
  const [month, setMonth] = useState("");
  const userInfo = useUserInfo();
  const dispatch = useUserInfoDispatch();

  useEffect(() => {
    if (userInfo?.payDayToDisplay) {
      let dateToDisplay = new Date(userInfo?.payDayToDisplay!);
      let month = dateToDisplay.toLocaleString("default", { month: "long" });
      setMonth(month);
    }
  }, [userInfo?.payDayToDisplay]);

  useEffect(() => {
    if (userInfo?.payMonthAndYearToDisplay) {
      setMonth(userInfo?.payMonthAndYearToDisplay!.split(" ")[0]!);
    }
  }, [userInfo?.payMonthAndYearToDisplay]);
  return (
    <View>
      {month && (
        <SafeAreaView
          style={{ backgroundColor: "#379D9F", alignItems: "center" }}
          className="flex flex-row"
        >
          <Text className="text-2xl font-bold text-white text-center px-2">
            {month}
          </Text>
          <Link asChild href={"/monthModal"}>
            <AntDesign name="down" size={18} color={"white"} />
          </Link>
        </SafeAreaView>
      )}
    </View>
  );
}