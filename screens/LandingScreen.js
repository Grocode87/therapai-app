/** Register Screen */

import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  StyleSheet,
  Linking,
  Text,
  View,
  TextInput,
  Button,
  Pressable,
} from "react-native";
import CustomButton from "../components/CustomButton";

function LandingScreen({ navigation }) {
  return (
    <LinearGradient colors={["#89CFF0", "#2291C5"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.title}>Lorem</Text>
          <Text style={styles.subTitle}>AI Powered Therapy</Text>
        </View>

        <View style={styles.bottomContainer}>
          <Pressable
            onPress={() => {
              navigation.navigate("Registration");
            }}
            style={[styles.button, styles.signUpButton]}
          >
            <Text>Sign Up With Phone #</Text>
          </Pressable>
          <CustomButton
            text={"Log In"}
            onPress={() => {
              navigation.navigate("Registration");
            }}
            style={[styles.button, styles.signUpButton]}
          >
            <Text></Text>
          </CustomButton>
          <Text style={styles.agreeText}>
            By clicking "Sign up with phone #", you acknowledge that you have
            read the{" "}
            <Text
              style={styles.agreeTextBold}
              onPress={() => {
                Linking.openURL(
                  "https://therapai-site.vercel.app/privacy-policy"
                );
              }}
            >
              Privacy Policy
            </Text>{" "}
            and agree with our{" "}
            <Text
              style={styles.agreeTextBold}
              onPress={() => {
                Linking.openURL(
                  "https://therapai-site.vercel.app/terms-of-service"
                );
              }}
            >
              Terms of Service
            </Text>
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  topContainer: {
    height: "40%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#fff",
  },
  subTitle: {
    fontSize: 16,
    color: "#fff",
  },
  bottomContainer: {
    paddingBottom: 50,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  agreeText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    color: "#fff",
    marginTop: 5,
  },
  agreeTextBold: {
    fontWeight: "bold",
    color: "white",
  },
  button: {
    width: "100%",
    height: 45,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    backgroundColor: "#e0e0e0",
  },
  signInButton: {
    backgroundColor: "#3f3f3f",
  },
  signInButtonText: {
    color: "white",
  },
});

export default LandingScreen;
