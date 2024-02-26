import { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  useWindowDimensions,
  ImageBackground,
  SafeAreaView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Icon } from "react-native-paper";
import { appSignOut } from "../../store";
import { router, useFocusEffect } from "expo-router";
import { BarChart } from "react-native-chart-kit";
import { Stack } from "expo-router";
import axiosInstance from "../../utils/helpers/axiosInstance";
import { useUserInfo } from "../../context/userInfoContext";

const image = require("../../assets/images/bgImage.png");

export default function Profile() {
  const userInfo = useUserInfo();
  const [YTDEarnings, setYTDEarnings] = useState("");
  const [totalSickHours, setTotalSickHours] = useState("");
  const [OTHours, setOTHours] = useState("");
  const [lateCallhours, setLateCallHours] = useState("");

  const [recallHours, setRecallHours] = useState("");

  const [dataForTable, setDataForTable] = useState<number[]>([]);
  const insets = useSafeAreaInsets();

  const signOut = async () => {
    try {
      await appSignOut();
      router.push("/homeScreen");
    } catch (error: any) {
      console.log(error);
    }
  };

  const hourlyWage = parseFloat(userInfo?.hourlyWage || "0");
  const sickHours = parseFloat(totalSickHours || "0");

  const wagesLost = sickHours * hourlyWage * 0.25;

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        data: dataForTable,
      },
    ],
  };

  const getYTD = async () => {
    try {
      let response = await axiosInstance.post("/getDeductions/getYTD", {
        userInfo,
      });
      let { months } = response.data;

      const monthlyIncome: number[] = new Array(12).fill(0);

      months.forEach(({ income, month }: any) => {
        const currentMonth = new Date(month).getMonth(); // Extract the month number from the date

        // Add income to the corresponding month in the array
        monthlyIncome[currentMonth] += income;
      });
      const cumulativeSumResult: number[] = [];

      let sum = 0;
      for (let i = 0; i < monthlyIncome.length; i++) {
        sum += monthlyIncome[i]; // Add the current value to the sum
        cumulativeSumResult.push(parseFloat(sum.toFixed(2))); // Push the updated sum to the result array
      }
      setYTDEarnings(
        cumulativeSumResult[cumulativeSumResult.length - 1].toFixed(2)
      );
      setDataForTable(cumulativeSumResult);
    } catch (error) {
      console.log(error);
    }
  };

  const getSickHours = async () => {
    try {
      let response = await axiosInstance.post("/getDeductions/getSickHours", {
        userInfo,
      });
      let { totalHours } = response.data;
      setTotalSickHours(totalHours);
    } catch (error) {
      console.log(error);
    }
  };
  const getOTHours = async () => {
    try {
      let response = await axiosInstance.post("/getDeductions/getOTHours", {
        userInfo,
      });
      let { totalOTHours, totalRecallHours, totalLateCallHours } =
        response.data.data;
      setOTHours(totalOTHours);
      setRecallHours(totalRecallHours);
      setLateCallHours(totalLateCallHours);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await getYTD();
        await getSickHours();
        await getOTHours();
      };
      fetchData();
    }, [])
  );

  const chartConfig = {
    color: () => `rgba(1, 1, 1, 1)`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
    decimalPlaces: 0,
    backgroundGradientFrom: "#3db8ba",
    backgroundGradientTo: "#3db8ba",
  };
  const shadowStyle = {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 2,
  };

  return (
    <>
      <ImageBackground source={image} style={{ flex: 1 }}>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: "",
            headerTransparent: true,
            headerBackTitleVisible: false,
            headerLeft: () => {
              return (
                <Button
                  icon={"arrow-left"}
                  textColor="white"
                  onPress={() => router.replace("/(app)/dashboard")}
                >
                  {" "}
                  Back{" "}
                </Button>
              );
            },
          }}
        />
        <SafeAreaView>
          <ScrollView
            className="flex flex-col"
            contentContainerStyle={{
              flexDirection: "column",
              alignItems: "center",
              paddingBottom: 200,
              paddingTop: Platform.OS === "android" ? insets.top * 1.5 : 0,
            }}
          >
            <View className="w-5/6">
              <Text className="text-2xl text-center">
                Profile - {userInfo?.email}
              </Text>
              <View
                className="flex flex-row items-center bg-white rounded-md p-3 my-2 shadow-lg"
                style={shadowStyle}
              >
                <View className="p-1 bg-gray-300 rounded-md mr-3">
                  <Icon source={"cash-plus"} size={40} />
                </View>
                <View className="flex flex-col">
                  <Text>Projected Yearly Gross</Text>
                  <Text className="text-lg">
                    {parseFloat(YTDEarnings).toLocaleString("en-us", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </Text>
                </View>
              </View>
              <View
                className="flex flex-row items-center bg-white rounded-md p-3 my-2 shadow-lg"
                style={shadowStyle}
              >
                <View className="p-1 bg-gray-300 rounded-md mr-3">
                  <Icon source={"bed"} size={40} color="green" />
                </View>
                <View className="flex flex-col">
                  <Text>Sick Hours</Text>
                  <Text className="text-lg">{totalSickHours} Hours</Text>
                  <Text>
                    Wages lost
                    {" " +
                      wagesLost.toLocaleString("en-us", {
                        currency: "USD",
                        style: "currency",
                      })}
                  </Text>
                </View>
              </View>
              <View
                className="flex flex-row items-center bg-white rounded-md p-3 my-2 shadow-lg"
                style={shadowStyle}
              >
                <View className="p-1 bg-gray-300 rounded-md mr-3">
                  <Icon source={"clock-plus"} size={40} color="green" />
                </View>
                <View className="flex flex-col">
                  <Text>Regular OT Hours</Text>
                  <Text className="text-lg">{OTHours} Hours</Text>
                  <Text className="text-md text-green-600">
                    OT Earnings{" "}
                    {(
                      parseFloat(OTHours) *
                      (parseFloat(userInfo?.hourlyWage!) * 1.5)
                    ).toLocaleString("en-us", {
                      currency: "USD",
                      style: "currency",
                    })}
                  </Text>
                </View>
              </View>
              <View
                className="flex flex-row items-center bg-white rounded-md p-3 my-2 shadow-lg"
                style={shadowStyle}
              >
                <View className="p-1 bg-gray-300 rounded-md mr-3">
                  <Icon source={"clock-plus"} size={40} color="green" />
                </View>
                <View className="flex flex-col">
                  <Text>Recall Hours</Text>
                  <Text className="text-lg">{recallHours} Hours</Text>
                  <Text className="text-md text-green-600">
                    Holiday Recall Earnings{" "}
                    {(
                      parseFloat(recallHours) *
                      (parseFloat(userInfo?.hourlyWage!) * 2.0)
                    ).toLocaleString("en-us", {
                      currency: "USD",
                      style: "currency",
                    })}
                  </Text>
                </View>
              </View>
              <View
                className="flex flex-row items-center bg-white rounded-md p-3 my-2 shadow-lg"
                style={shadowStyle}
              >
                <View className="p-1 bg-gray-300 rounded-md mr-3">
                  <Icon source={"clock-plus"} size={40} color="green" />
                </View>
                <View className="flex flex-col">
                  <Text>Late Call Hours</Text>
                  <Text className="text-lg">{lateCallhours} Hours</Text>
                  <Text className="text-md text-green-600">
                    Late Call Earnings{" "}
                    {(
                      parseFloat(lateCallhours) *
                      (parseFloat(userInfo?.hourlyWage!) *
                        (userInfo?.shiftPattern === "Alpha" ? 2.0 : 1.5))
                    ).toLocaleString("en-us", {
                      currency: "USD",
                      style: "currency",
                    })}
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <Text className="text-2xl text-center">
                Projected Yearly Income
              </Text>
              <BarChart
                data={data}
                width={useWindowDimensions().width}
                height={320}
                yAxisLabel="$"
                chartConfig={chartConfig}
                verticalLabelRotation={90}
                yAxisSuffix="k"
                fromZero
                showValuesOnTopOfBars
              />
            </View>
            <View className="flex flex-row gap-4 mt-3">
              <Button
                icon="account-edit"
                mode="elevated"
                onPress={() =>
                  router.push({
                    pathname: "/workShift",
                    params: { isEditing: true },
                  })
                }
                textColor="black"
              >
                Edit Info
              </Button>
              <Button
                icon="logout"
                mode="elevated"
                onPress={signOut}
                textColor="black"
              >
                Log Out
              </Button>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}
