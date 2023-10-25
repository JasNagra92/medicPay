import { Slot, Stack } from "expo-router";
import { UserInfoProvider } from "../context/userInfoContext";

export default function HomeLayout() {
  return (
    <UserInfoProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="dashboard"
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
