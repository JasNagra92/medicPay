import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const HeaderGear = () => {
  return (
    <MaterialCommunityIcons
      name="account-settings"
      size={32}
      color={"white"}
      onPress={() => router.push("/profile")}
    />
  );
};

export default HeaderGear;
