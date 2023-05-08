/***
 * Onboarding screen
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import {
  Button,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import CustomButton from "../components/CustomButton";
import { useAlert } from "../context/alertContext";

import { useAuth } from "../context/authContext";
import { getUserData, updateUserData } from "../services/api";

import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "../utils/utils";

const OnboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [currPage, setCurrPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [firstName, setFirstName] = useState(userData?.first_name || "");
  const [lastName, setLastName] = useState(userData?.last_name || "");
  const [date, setDate] = useState(new Date(2000, 5, 15));

  const scrollViewRef = useRef();

  const { setAlert } = useAlert();

  const queryClient = useQueryClient();
  const { data: userData } = useQuery(
    ["userData"],
    async () => {
      token = await user.getIdToken();
      console.log("retrieving token");
      return getUserData(token, user.uid);
    },
    {
      enabled: user != null,
    }
  );
  const userDataMutation = useMutation(
    async (newData) => {
      setIsLoading(true);
      const token = await user.getIdToken();
      return updateUserData(token, user.uid, newData);
    },
    {
      onSuccess: (data) => {
        console.log("Mutation succeeded with data:", data);
        queryClient.setQueryData(["userData"], data);
        scrollToNextPage();
        setIsLoading(false);
      },
      onError: (error) => {
        console.error("Mutation failed with error:", error);
        setAlert({
          show: true,
          title: "Error",
          message: "Something went wrong. Please try again later.",
          type: "error",
        });
        setIsLoading(false);
      },
    }
  );
  // currPage defaults to 0
  // 0: first name
  // 1: last name
  // 2: birthday
  // 3: done

  const scrollToNextPage = () => {
    setCurrPage(currPage + 1);
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: Dimensions.get("window").width * currPage, // Scroll to the next page by the screen width
        y: 0,
        animated: true,
      });
    }
  }, [currPage]);

  useEffect(() => {
    if (userData?.first_name) {
      setCurrPage(1);
      if (userData?.last_name) {
        setCurrPage(2);
      }
    }
  }, [userData]);

  const renderPage1 = () => {
    return (
      <SafeAreaView
        style={[styles.container, { width: Dimensions.get("window").width }]}
      >
        <Text style={styles.main_text}>Lets get you set up</Text>
        <Text style={styles.main_text_bold}>Whats your first name?</Text>
        <View style={styles.input_container}>
          <Text style={styles.input_label}>First Name</Text>
          <TextInput
            style={styles.text_input}
            value={firstName}
            onChangeText={setFirstName}
          />
          <CustomButton
            text="Next"
            style={styles.next_button}
            isLoading={isLoading}
            onPress={() => {
              if (firstName.length >= 3) {
                userDataMutation.mutate({ ...userData, first_name: firstName });
              }
            }}
          />
        </View>
      </SafeAreaView>
    );
  };

  const renderPage2 = () => {
    return (
      <SafeAreaView
        style={[styles.container, { width: Dimensions.get("window").width }]}
      >
        <Text style={styles.main_text}>Lets get you set up</Text>
        <Text style={styles.main_text_bold}>Whats your last name?</Text>
        <View style={styles.input_container}>
          <Text style={styles.input_label}>Last Name</Text>
          <TextInput
            style={styles.text_input}
            value={lastName}
            onChangeText={setLastName}
          />
          <CustomButton
            style={styles.next_button}
            isLoading={isLoading}
            text="Next"
            onPress={() => {
              console.log(lastName);
              if (lastName.length >= 2) {
                userDataMutation.mutate({ ...userData, last_name: lastName });
              }
            }}
          />
        </View>
      </SafeAreaView>
    );
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const renderPage3 = () => {
    return (
      <SafeAreaView
        style={[
          {
            flex: 1,
            height: "100%",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "space-between",
          },
          { width: Dimensions.get("window").width },
        ]}
      >
        <View
          style={{
            alignItems: "center",
            flex: 1,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Text style={styles.main_text}>Lets get you set up</Text>
          <Text style={styles.main_text_bold}>When where you born?</Text>
          <View style={styles.input_container}>
            <Text style={styles.input_label}>Birthday</Text>
            <View
              style={{
                height: 40,
                borderBottomColor: "white",
                borderBottomWidth: 2,
                fontSize: 24,
                marginBottom: 60,
                flexDirection: "row",
                alignItems: "flex-end",
              }}
            >
              <Text style={{ fontSize: 24, color: "white" }}>
                {formatDate(date)}
              </Text>
            </View>
            <CustomButton
              style={styles.next_button}
              isLoading={isLoading}
              text="Finish"
              onPress={() => {
                userDataMutation.mutate({
                  ...userData,
                  birthday: date.toISOString(),
                });
              }}
            />
          </View>
        </View>
        <View>
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display="spinner"
            onChange={onChangeDate}
            textColor="white"
          />
        </View>
      </SafeAreaView>
    );
  };

  const renderPage = (num) => {
    if (num == 0) {
      return renderPage1();
    }
    if (num == 1) {
      return renderPage2();
    }
    if (num == 2) {
      return renderPage3();
    }
  };
  return (
    <LinearGradient colors={["#89CFF0", "#2291C5"]} style={{ flex: 1 }}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
      >
        {renderPage(0)}
        {renderPage(1)}
        {renderPage(2)}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 240,
  },
  main_text: { fontSize: 16, paddingBottom: 10, color: "white" },
  main_text_bold: { fontSize: 24, fontWeight: "bold", color: "white" },
  input_container: { width: "80%", marginTop: 80 },
  input_label: {
    fontSize: 16,
    fontWeight: "300",
    marginBottom: 0,
    color: "white",
  },
  text_input: {
    height: 40,
    borderBottomColor: "white",
    borderBottomWidth: 2,
    fontSize: 24,
    marginBottom: 60,
    color: "white",
  },

  next_button: {
    marginTop: 50,
  },
  next_button_text: {
    fontSize: 16,
    color: "black",
  },
});

export default OnboardScreen;
