import { Stack, router } from "expo-router";
import { OpenSans_800ExtraBold, useFonts } from "@expo-google-fonts/open-sans";
import { Button } from "react-native-paper";

export default function HomeLayout() {
  let [fontsLoaded, fontError] = useFonts({
    OpenSans_800ExtraBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
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
          headerBackTitleVisible: false,
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
          headerLeft: () => {
            return (
              <Button
                icon={"arrow-left"}
                textColor="white"
                onPress={() => router.back()}
              >
                {" "}
                Back{" "}
              </Button>
            );
          },
        }}
      />
      <Stack.Screen
        name="monthModal"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="stiipModal"
        options={{
          presentation: "modal",
          contentStyle: {
            marginTop: "115%",
            overflow: "hidden",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
        }}
      />
      <Stack.Screen
        name="overtimeModal"
        options={{
          presentation: "modal",
          contentStyle: {
            marginTop: "80%",
            overflow: "hidden",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
        }}
      />
      <Stack.Screen
        name="deductionsModal"
        options={{
          presentation: "modal",
          contentStyle: {
            marginTop: "90%",
            overflow: "hidden",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            backgroundColor: "white",
          },
        }}
      />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
