import React from "react";
import { Text } from "react-native";
import { Link } from "expo-router";

export default function Dashboard() {
  return (
    <Link href="/">
      <Text>test route</Text>
    </Link>
  );
}
