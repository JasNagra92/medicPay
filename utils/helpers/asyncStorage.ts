import AsyncStorage from "@react-native-async-storage/async-storage";
import { IPayPeriodData, IUserInfo } from "../../interfaces/IAppState";

export const handleSavePayPeriodData = async (payPeriod: IPayPeriodData[]) => {
  try {
    // Serialize the data array into a string before storing it
    await AsyncStorage.setItem("payPeriod", JSON.stringify(payPeriod));
    console.log("Pay Period Data saved successfully");
  } catch (error) {
    console.error("Error saving pay data:", error);
  }
};
export const handleSaveUserData = async (userInfo: IUserInfo) => {
  try {
    // Serialize the data array into a string before storing it
    await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
    console.log("User Data saved successfully");
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

export const fetchPayPeriodData = async (payPeriodDispatch: any) => {
  try {
    // Fetch data from AsyncStorage
    const payPeriod = await AsyncStorage.getItem("payPeriod");
    if (payPeriod !== null) {
      // Deserialize the stored data back into an array of objects
      payPeriodDispatch({
        type: "setPayPeriod",
        payload: JSON.parse(payPeriod),
      });
    }
  } catch (error) {
    console.error("Error fetching pay data:", error);
  }
};
export const fetchUserData = async (userInfoDispatch: any) => {
  try {
    // Fetch data from AsyncStorage
    const userInfo = await AsyncStorage.getItem("userInfo");
    if (userInfo !== null) {
      // Deserialize the stored data back into an array of objects
      userInfoDispatch({
        type: "setUser",
        payload: JSON.parse(userInfo),
      });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
