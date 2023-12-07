import { Slot } from "expo-router";
import { UserInfoProvider } from "../context/userInfoContext";
import { PayPeriodProvider } from "../context/payPeriodDataContext";

export default function Root() {
  return (
    <UserInfoProvider>
      <PayPeriodProvider>
        <Slot />
      </PayPeriodProvider>
    </UserInfoProvider>
  );
}
