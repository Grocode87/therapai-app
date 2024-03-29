/** Register Screen */

import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { useAlert } from "../context/alertContext";
import { useAuth } from "../context/authContext";
import CustomButton from "../components/CustomButton";

function VerifyScreen({ navigation, route }) {
  const textInputRef = useRef(null);
  const [code, setCode] = useState("");

  const [timeUntilResend, setTimeUntilResend] = useState(120);
  const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);
  const [isLoadingResend, setIsLoadingResend] = useState(false);

  const { user, signInWithPhoneNumber, confirmCode } = useAuth();

  const phoneNumber = route.params.phoneNumber;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilResend((timeUntilResend) => timeUntilResend - 1);
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  const handleResendCode = async () => {
    setIsLoadingResend(true);
    await signInWithPhoneNumber("+" + phoneNumber);
    setIsLoadingResend(false);
  };

  const handleSubmitCode = async (verificationCode) => {
    setIsLoadingConfirm(true);
    await confirmCode(verificationCode);
    setIsLoadingConfirm(false);
  };

  return (
    <LinearGradient colors={["#89CFF0", "#2291C5"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Enter your verification code</Text>
        <Text style={styles.subTitle}>
          Sent to{" "}
          <Text style={{ color: "white", fontWeight: "bold" }}>
            +{phoneNumber}
          </Text>
        </Text>

        <TextInput
          style={{ height: 0, width: 0, borderWidth: 0 }}
          onChangeText={(text) => {
            if (text.length >= 6) {
              // submit the code
              setCode(text);
              handleSubmitCode(text);
            } else {
              setCode(text);
            }
          }}
          ref={textInputRef}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          keyboardType="phone-pad"
          autoComplete="tel"
        />

        <View
          style={{
            width: "100%",
            flexDirection: "row",
            gap: 10,
            paddingBottom: 50,
            position: "relative",
            justifyContent: "center", // Add this line
            alignItems: "center", // Add this line
          }}
        >
          <View
            style={{
              position: "absolute",
              width: 15,
              height: 15,
              bottom: 0,
            }}
          >
            {isLoadingConfirm && (
              <ActivityIndicator
                size="small"
                color="#ffffff"
                style={{ width: "100%", height: "100%" }} // Add this line
              />
            )}
          </View>
          {[...Array(6).keys()].map((i) => {
            return (
              <View
                key={i}
                style={{
                  flex: 1,
                  height: 30,
                  borderBottomWidth: 2,
                  borderColor: "white",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20, color: "white" }}>
                  {code.at(i)}
                </Text>
              </View>
            );
          })}
        </View>

        <View
          style={{
            width: "100%",
            marginVertical: 5,
            marginBottom: 315,
            marginTop: 120,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CustomButton
            text={
              timeUntilResend > 0
                ? "Resend Code In " + timeUntilResend
                : "Resend Code"
            }
            onPress={handleResendCode}
            disabled={timeUntilResend > 0}
            isLoading={isLoadingResend}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    marginHorizontal: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  subTitle: {
    color: "white",
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 30,
  },
  input: {
    height: 40,
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
  },
});

export default VerifyScreen;
