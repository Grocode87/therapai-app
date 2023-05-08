import { LinearGradient } from "expo-linear-gradient";

const SplashScreen = () => {
  return (
    <LinearGradient
      colors={["#89CFF0", "#2291C5"]}
      style={{ flex: 1 }}
    ></LinearGradient>
  );
};

export default SplashScreen;
