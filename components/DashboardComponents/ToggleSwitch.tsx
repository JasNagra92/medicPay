import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Link } from "expo-router";

interface IToggleSwitchProps {
  date: Date;
}

export default function ToggleSwitch({ date }: IToggleSwitchProps) {
  const [selected, setSelected] = useState("");

  const handleSelect = (value: string) => {
    if (selected === value) {
      setSelected("");
    } else {
      setSelected(value);
    }
  };

  return (
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
      className="rounded-2xl bg-white flex flex-row mb-2"
    >
      <Link
        href={{ pathname: "/stiipModal", params: { date: date.toISOString() } }}
        asChild
      >
        <TouchableOpacity
          className={`rounded-2xl m-0.5 px-3 py-1 ${
            selected === "Stiip" ? "bg-[#379D9F]" : "white"
          }`}
          onPress={() => {
            handleSelect("Stiip");
          }}
        >
          <Text
            className={`${
              selected === "Stiip" ? "text-white" : "text-[#379D9F]"
            }`}
          >
            Stiip
          </Text>
        </TouchableOpacity>
      </Link>
      <TouchableOpacity
        className={`rounded-2xl m-0.5 px-4 py-1 ${
          selected === "OT" ? "bg-[#379D9F]" : "white"
        }`}
        onPress={() => handleSelect("OT")}
      >
        <Text
          className={`${selected === "OT" ? "text-white" : "text-[#379D9F]"}`}
        >
          OT
        </Text>
      </TouchableOpacity>
    </View>
  );
}
