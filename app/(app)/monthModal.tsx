import { useState, useEffect } from "react";
import { ScrollView, ImageBackground, Text, View } from "react-native";
import MonthDisplay from "../../components/MonthModalComponents/MonthDisplay";
import { StatusBar } from "expo-status-bar";
import DropDownPicker from "react-native-dropdown-picker";
const image = require("../../assets/images/bgImage.png");

export default function MonthModal() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(2024);
  const [year, setYear] = useState([
    { label: "2024", value: 2024 },
    { label: "2025", value: 2025 },
  ]);
  const [monthAndYearArray, setMonthAndYearArray] = useState<string[]>([]);

  const generateMonthYearArray = (selectedYear: number) => {
    const months = Array.from({ length: 12 }, (_, i) => i); // Creates an array [0, 1, ..., 11]

    const monthYearArray = months.map((monthIndex) => {
      const date = new Date(selectedYear, monthIndex, 1);
      const monthName = date.toLocaleDateString("default", { month: "long" });
      return `${monthName} ${selectedYear}`;
    });

    return monthYearArray;
  };

  useEffect(() => {
    let data = generateMonthYearArray(value);
    setMonthAndYearArray(data);
  }, [value]);

  return (
    <ImageBackground source={image} style={{ flex: 1 }}>
      <View className="flex flex-col justify-center">
        <Text className="text-lg text-white font-bold pr-2 text-center">
          Select Year
        </Text>
        <DropDownPicker
          open={open}
          value={value}
          items={year}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setYear}
          containerStyle={{
            width: 150,
            alignSelf: "center",
          }}
          dropDownDirection="BOTTOM"
          placeholder="Select Year"
          dropDownContainerStyle={{ elevation: 1000, zIndex: 1000 }}
        />

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
          {monthAndYearArray.map((date, i) => {
            return <MonthDisplay monthAndYear={date} key={i} />;
          })}
          <StatusBar style="light" />
        </ScrollView>
      </View>
    </ImageBackground>
  );
}
