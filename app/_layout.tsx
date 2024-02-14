import "react-native-gesture-handler";
import { Slot } from "expo-router";
import { UserInfoProvider } from "../context/userInfoContext";
import { PayPeriodProvider } from "../context/payPeriodDataContext";
import Toast from "react-native-toast-message";

export default function Root() {
  return (
    <UserInfoProvider>
      <PayPeriodProvider>
        <Slot />
        <Toast position="top" topOffset={90} />
      </PayPeriodProvider>
    </UserInfoProvider>
  );
}
