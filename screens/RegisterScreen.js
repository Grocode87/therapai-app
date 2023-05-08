/** Register Screen */

import React, { useEffect, useRef, useState } from "react";
import { getAuth, PhoneAuthProvider, RecaptchaVerifier } from "firebase/auth";
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
import SlidingAlert from "../components/SlidingAlert";
import { useAlert } from "../context/alertContext";

function RegisterScreen({ navigation }) {
  const [error, setError] = useState("");
  const textInputRef = useRef(null);
  const [countryCode, setCountryCode] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");

  const recaptchaVerifierRef = useRef(null);
  const [verificationId, setVerificationID] = useState("");
  const attemptInvisibleVerification = false;

  let canSend = phoneNumber.length == 10;

  const { setAlert } = useAlert();

  const handleSendVerificationCode = async () => {
    if (canSend)
      try {
        const phoneProvider = new PhoneAuthProvider(auth); // initialize the phone provider.
        const verificationId = await phoneProvider.verifyPhoneNumber(
          "+" + countryCode + phoneNumber.slice(0, 10),
          recaptchaVerifierRef.current
        ); // get the verification id
        setVerificationID(verificationId); // set the verification id
        navigation.navigate("Verify", {
          phoneNumber: countryCode + phoneNumber,
          verificationId: verificationId,
        });
      } catch (error) {
        setError(`Error : ${error.message}`); // show the error
        setAlert({
          show: true,
          title: "Login Error",
          message:
            "We've ran into an error trying to send a code to this phone number. Please try again later.",
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

        <Pressable
          style={{
            width: "100%",
            height: 45,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 5,
            backgroundColor: "#3f3f3f",
            opacity: canSend ? 1 : 0.5,
            marginBottom: 315,
            marginTop: 120,
          }}
          onPress={handleSendVerificationCode}
        >
          <Text style={{ color: "white" }}>Send Code</Text>
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

export default RegisterScreen;
