// axiosInstance.js
import axios from "axios";
import { Platform } from "react-native";

const instance = axios.create({
  baseURL: __DEV__
    ? Platform.OS === "android"
      ? "http://10.0.2.2:9099"
      : "http://localhost:8000"
    : "https://medic-pay-backend-743722187410.herokuapp.com/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default instance;
