/** Register Screen */

import React, { useEffect, useRef, useState } from "react";
import {
  getAuth,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
} from "firebase/auth";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Pressable,
  SafeAreaView,
} from "react-native";

// createUserWIthEmailAndPassword is a firebase function
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firebaseConfig } from "../services/firebase";
import { LinearGradient } from "expo-linear-gradient";
import {
  FirebaseRecaptchaBanner,
  FirebaseRecaptchaVerifierModal,
} from "expo-firebase-recaptcha";
import { useAlert } from "../context/alertContext";

function VerifyScreen({ navigation, route }) {
  const [error, setError] = useState("");
  const textInputRef = useRef(null);
  const [code, setCode] = useState("");

  const [timeUntilResend, setTimeUntilResend] = useState(120);
  const recaptchaVerifierRef = useRef(null);

  const phoneNumber = route.params.phoneNumber;
  let verificationId = route.params.verificationId;

  const { setAlert } = useAlert();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilResend((timeUntilResend) => timeUntilResend - 1);
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  const handleResendCode = async () => {
    try {
      const phoneProvider = new PhoneAuthProvider(auth); // initialize the phone provider.
      console.log("+" + phoneNumber);
      const newVerificationId = await phoneProvider.verifyPhoneNumber(
        "+" + phoneNumber,
        recaptchaVerifierRef.current
      ); // get the verification id
      verificationId = newVerificationId; // set the verification id
      setTimeUntilResend(120);
    } catch (error) {
      setAlert({
        show: true,
        title: "Resend Code Error",
        message: "Something went wrong. Please try again later.",
        type: "error",
      });
    }
  };

  const handleSubmitCode = async (verificationCode) => {
    try {
      const credential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      await signInWithCredential(auth, credential);
    } catch (error) {
      let errorMsg = "Something went wrong. Please try again";
      switch (error.code) {
        case "auth/code-expired":
          errorMsg = "The code has expired. Please resend the code.";
        case "auth/invalid-verification-code":
          errorMsg = "The code you entered is invalid. Please try again.";
      }
      setAlert({
        show: true,
        title: "Login Error",
        message: errorMsg,
        type: "error",
      });
    }
  };

  return (
    <LinearGradient colors={["#89CFF0", "#2291C5"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifierRef}
          firebaseConfig={firebaseConfig}
          attemptInvisibleVerification={true}
        />

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
          }}
        >
          <View></View>
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

        <Pressable
          style={{
            width: "100%",
            height: 45,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 5,
            backgroundColor: "#3f3f3f",
            marginBottom: 315,
            marginTop: 120,
            opacity: timeUntilResend > 0 ? 0.5 : 1,
          }}
          onPress={handleResendCode}
        >
          <Text style={{ color: "white" }}>
            {timeUntilResend > 0
              ? "Resend Code In " + timeUntilResend
              : "Resend Code"}
          </Text>
        </Pressable>
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
