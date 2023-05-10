/** Register Screen */

import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  StyleSheet,
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
          <Text style={styles.title}>Therap</Text>
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
            read the Privacy Policy and agree with our Terms of Service
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
    fontSize: 11,
    textAlign: "center",
    color: "#fff",
    marginTop: 5,
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
