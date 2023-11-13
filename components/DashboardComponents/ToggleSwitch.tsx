import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import axiosInstance from "../../utils/helpers/axiosInstance";
import { usePayPeriodDispatch } from "../../context/payPeriodDataContext";
import { useUserInfo } from "../../context/userInfoContext";

interface IToggleSwitchProps {
  date: Date;
  index: number;
  rotation: string;
  shiftStart: Date;
  shiftEnd: Date;
}

export default function ToggleSwitch({
  date,
  index,
  rotation,
  shiftStart,
  shiftEnd,
}: IToggleSwitchProps) {
  const [selected, setSelected] = useState("");
  const router = useRouter();
  const userInfo = useUserInfo();
  const payPeriodDispatch = usePayPeriodDispatch();

  const handleStiipSelect = async (value: string) => {
    // logic to run if user is depressing the button indicating they are removing stiip and want the default values for the day back
    if (selected === value) {
      try {
        let response = await axiosInstance.post("/getPayData/getDefaultDay", {
          userInfo,
          date,
          rotation,
        });
        if (payPeriodDispatch) {
          payPeriodDispatch({
            type: "updateSingleDay",
            payload: { index, updatedSingleDay: response.data.data },
          });
        }
        setSelected("");
      } catch (error) {
        console.log(error);
      }
    } else {
      setSelected(value);
      router.push({
        pathname: "/stiipModal",
        params: {
          date: date.toISOString(),
          index,
          rotation,
          shiftStart,
          shiftEnd,
        },
      });
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
      <TouchableOpacity
        className={`rounded-2xl m-0.5 px-3 py-1 ${
          selected === "Stiip" ? "bg-[#379D9F]" : "white"
        }`}
        onPress={() => {
          handleStiipSelect("Stiip");
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
