import "dotenv/config";

export default {
  expo: {
    name: "medicPay",
    slug: "medicPay",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    scheme: "your-app-scheme",
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      icon: "",
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.yourcompany.medicPay",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["expo-router"],
    extra: {
      eas: {
        projectId: "86931160-22a8-4971-8b8d-f5c975fc4e69",
      },
    },
  },
};
