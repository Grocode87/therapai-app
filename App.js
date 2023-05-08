import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SlidingAlert from "./components/SlidingAlert";
import { AlertProvider } from "./context/alertContext";
import { AuthProvider } from "./context/authContext";
import Navigation from "./navigation";

const queryClient = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <AlertProvider>
        <SlidingAlert />
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <Navigation></Navigation>
          </QueryClientProvider>
        </AuthProvider>
      </AlertProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
