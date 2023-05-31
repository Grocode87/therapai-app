import React, { createContext, useState, useEffect, useContext } from "react";
import auth from "@react-native-firebase/auth";
import { deriveAndStoreKey, getKey } from "../services/encrypt";
import { useAlert } from "./alertContext";
import * as SplashScreen from "expo-splash-screen";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);

  const { setAlert } = useAlert();

  function onAuthStateChanged(user) {
    console.log("auth state changed");
    console.log("user:", user);
    setUser(user);
    setLoading(false);

    if (user) {
      console.log("user is logged in, ckecking key");
      getKey().then((credentials) => {
        if (!credentials) {
          deriveAndStoreKey(user.phoneNumber, user.uid);
        }
      });
    } else {
      SplashScreen.hideAsync();
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const signInWithPhoneNumber = async (phoneNumber) => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      return true;
    } catch (error) {
      console.log(phoneNumber);
      console.log(error);
      setAlert({
        show: true,
        title: "Login Error",
        message:
          "We've ran into an error trying to send a code to this phone number. Please try again later.",
        type: "error",
      });
      return false;
    }
  };

  const confirmCode = async (enteredCode) => {
    try {
      await confirm.confirm(enteredCode);
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

  const logout = () => {
    auth().signOut();
  };

  const value = {
    user,
    loading,
    signInWithPhoneNumber,
    confirmCode,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
