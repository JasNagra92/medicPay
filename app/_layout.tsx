import { Slot, Stack } from "expo-router";
import { UserInfoProvider } from "../context/userInfoContext";
import { OpenSans_800ExtraBold, useFonts } from "@expo-google-fonts/open-sans";

export default function HomeLayout() {
  let [fontsLoaded, fontError] = useFonts({
    OpenSans_800ExtraBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <UserInfoProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            headerTitle: "Medic Pay",
            headerTitleStyle: {
              fontFamily: "OpenSans_800ExtraBold",
              fontSize: 30,
              color: "white",
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="workShift"
          options={{
            headerShown: true,
            headerTitle: "Work Shift",
            headerTitleStyle: {
              fontFamily: "OpenSans_800ExtraBold",
              fontSize: 30,
              color: "white",
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="dashboard"
          options={{
            headerShown: true,
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="FinalTotal"
          options={{
            headerShown: true,
            headerTitle: "",
            headerTransparent: true,
          }}
        />
      </Stack>
    </UserInfoProvider>
  );
}
