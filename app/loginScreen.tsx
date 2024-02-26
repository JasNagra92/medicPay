import { router } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MainPageInput from "../components/LoginSignUpInput";
import { appSignIn } from "../store";
import Toast from "react-native-toast-message";
import { useUserInfo, useUserInfoDispatch } from "../context/userInfoContext";
import { Image } from "expo-image";
import axiosInstance from "../utils/helpers/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { monthNames } from "../utils/helpers/constants";
import getPayDaysFromServer from "../utils/helpers/serverCalls";
import { usePayPeriodDispatch } from "../context/payPeriodDataContext";
import { DateTime } from "luxon";

const logo = require("../assets/images/logo.jpeg");

export default function Login() {
  const userInfoDispatch = useUserInfoDispatch();
  const payPeriodDispatch = usePayPeriodDispatch();
  const userInfo = useUserInfo();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await appSignIn(email, password);
      if (userInfoDispatch && userCredential) {
        userInfoDispatch({
          type: "setUserId",
          payload: userCredential.user?.uid!,
        });
      }

      const response = await axiosInstance.post("/users/getUser", {
        id: userCredential.user.uid,
      });
      if (userInfoDispatch && userCredential) {
        userInfoDispatch({
          type: "setUser",
          payload: response.data.data,
        });

        try {
          const value = await AsyncStorage.getItem("monthAndYear");
          if (value !== null && userInfoDispatch) {
            userInfoDispatch({
              type: "setPayMonthAndYearToDisplay",
              payload: value,
            });
            const requestedMonthName = value.split(" ")[0];
            const monthNumber = monthNames.indexOf(requestedMonthName!) + 1;
            const requestedYear = value.split(" ")[1];

            getPayDaysFromServer(
              userInfo!,
              monthNumber,
              parseInt(requestedYear!),
              payPeriodDispatch!
            );
          }
        } catch (e) {
          console.log("error reading month and year from storage");
          let today = DateTime.now();
          getPayDaysFromServer(
            userInfo!,
            today.month,
            today.year,
            payPeriodDispatch!
          );
        }
      }

      router.push("/dashboard");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `${error.message}`,
        visibilityTime: 3000,
      });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
    >
      <View
        style={{
          width: "50%",
          height: 175,
        }}
      >
        <Image
          source={logo}
          transition={1000}
          style={{ justifyContent: "center", flex: 1 }}
          contentFit="cover"
        />
      </View>
      <View className="flex flex-col items-center">
        <Text className="text-black text-5xl font-bold">MedicPay!</Text>
        <Text className="text-xl">Login</Text>
      </View>
      <View className="rounded-2xl bg-white border-0 flex flex-col w-96 ">
        <MainPageInput
          icon="mail"
          placeholder="Email"
          handleChange={setEmail}
        />
        <MainPageInput
          icon="lock"
          placeholder="Password"
          handleChange={setPassword}
        />

        <View className="flex flex-row justify-center">
          <TouchableOpacity
            className="flex-1 m-4 rounded-xl bg-[#a9c28f] p-3"
            onPress={() => router.back()}
          >
            <Text className="text-center font-bold text-white text-lg">
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 rounded-xl m-4 bg-[#96c560] p-3"
            onPress={handleLogin}
          >
            <Text className="text-center font-bold text-white text-lg">
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
