/** Register Screen */

import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Pressable,
  SafeAreaView,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/authContext";
import CustomButton from "../components/CustomButton";

function RegisterScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const textInputRef = useRef(null);
  const [countryCode, setCountryCode] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { user, signInWithPhoneNumber } = useAuth();

  let canSend = phoneNumber.length == 10;

  const handleSendVerificationCode = async () => {
    if (canSend) {
      console.log("sensing verification code");
      setLoading(true);
      const success = await signInWithPhoneNumber(
        "+" + countryCode + phoneNumber
      );
      setLoading(false);
      if (success) {
        console.log("success");
        navigation.navigate("Verify", {
          phoneNumber: countryCode + phoneNumber,
        });
      }
    }
  };

  return (
    <LinearGradient colors={["#89CFF0", "#2291C5"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>What is your phone #?</Text>
        <Text style={styles.subTitle}>
          We'll send you a code to make sure it's you
        </Text>

        <TextInput
          style={{ height: 0, width: 0, borderWidth: 0 }}
          onChangeText={(text) => {
            const isAppleAutocompleteFormat = /^\d \(\d{3}\)/.test(text);

            if (isAppleAutocompleteFormat) {
              const cleanedPhoneNumber = text
                .replace(/[^0-9]/g, "")
                .slice(1, 11);
              setPhoneNumber(cleanedPhoneNumber);
            } else {
              if (text.length <= 10) {
                setPhoneNumber(text.replace(/[^0-9]/g, ""));
              }
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
          }}
        >
          <View>
            <Text style={{ fontSize: 20, color: "white" }}>
              + {countryCode}
            </Text>
          </View>
          {[...Array(10).keys()].map((i) => {
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
                  {phoneNumber.at(i)}
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
            text="Send Code"
            onPress={handleSendVerificationCode}
            disabled={!canSend}
            isLoading={loading}
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

export default RegisterScreen;
