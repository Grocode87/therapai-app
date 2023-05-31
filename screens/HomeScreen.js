import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Button,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useAuth } from "../context/authContext";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getUserData, processSession } from "../services/api";
import moment from "moment/moment";
import { useUserHistory } from "../hooks/useUserHistory";
import Journal from "../components/home/Journal";
import TherapistImage from "../components/TherapistImage";
import { therapists } from "../utils/constants";

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { data: userData } = useQuery(
    ["userData"],
    async () => {
      token = await user.getIdToken();
      return getUserData(token, user.uid);
    },
    {
      enabled: user != null,
    }
  );
  const insets = useSafeAreaInsets();

  // For the continue conversation button
  const continueConvoTranslateY = useRef(new Animated.Value(0)).current;
  const [scrollDirection, setScrollDirection] = useState("up");

  // for the animated header
  const [showLargeHeader, setShowLargeHeader] = useState(true);
  const HEADER_MIN_HEIGHT = 40 + insets.top;
  const HEADER_MAX_HEIGHT = 180;
  const bigHeaderTranslateY = useRef(new Animated.Value(0)).current;
  const smallHeaderOpacity = useRef(new Animated.Value(0)).current;
  const smallHeaderHeight = useRef(
    new Animated.Value(HEADER_MIN_HEIGHT - 20)
  ).current;

  useEffect(() => {
    // Animate the continue conversation button based on scroll direction
    // Disappear when scrolling down, reappear when scrolling up
    Animated.timing(continueConvoTranslateY, {
      toValue: scrollDirection === "down" ? 300 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [scrollDirection, continueConvoTranslateY]);

  useEffect(() => {
    Animated.timing(bigHeaderTranslateY, {
      toValue: showLargeHeader ? 0 : -150,
      duration: 100,
      useNativeDriver: true,
    }).start();

    Animated.timing(smallHeaderOpacity, {
      toValue: showLargeHeader ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    Animated.timing(smallHeaderHeight, {
      toValue: showLargeHeader ? HEADER_MIN_HEIGHT - 20 : HEADER_MIN_HEIGHT,
      duration: 50,
      useNativeDriver: false,
    }).start();
  }, [showLargeHeader]);

  const handleOnScroll = (event) => {
    /**
     * sets scroll direction and showLargeHeader
     */

    // Decide whether to show the large header or not
    setShowLargeHeader(event.nativeEvent.contentOffset.y <= 40);

    // Handle the new scroll direction
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > 1 ? "down" : "up";
    setScrollDirection(direction);
  };

  useEffect(() => {
    console.log("PROCESSING SESSIONS");
    userData?.sessions.forEach((session) => {
      if (session.end_time && !session.processed) {
        console.log("FOUND SESSION TO PROCESS");
        processSession(user, userData, session);
      }
    });
  }, [userData]);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={["#89CFF0", "#2291C5"]} style={{ flex: 1 }}>
        <ScrollView
          style={styles.scrollView}
          scrollEventThrottle={16}
          onScroll={handleOnScroll}
        >
          <View style={{ height: HEADER_MAX_HEIGHT }} />
          <View style={styles.content}>
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.card_title}>Your AI Therapist</Text>
                <Pressable
                  onPress={() => navigation.navigate("TherapistSelect")}
                >
                  <Text style={{ color: "white" }}>Switch</Text>
                </Pressable>
              </View>
              <View style={{ flex: 1, flexDirection: "row", marginTop: 20 }}>
                <View style={{ width: "35%" }}>
                  <TherapistImage
                    therapist={therapists.find(
                      (therapist) => therapist.name === userData.therapist
                    )}
                  />
                </View>
                <View
                  style={{
                    marginLeft: 20,
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: 20, color: "white" }}>
                    {userData.therapist || "None"}
                  </Text>
                  <Pressable
                    onPress={() =>
                      navigation.navigate("Chat", { name: "Jane" })
                    }
                    style={{
                      height: 40,
                      backgroundColor: "#F5A623",
                      color: "white",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ fontSize: 16, color: "white" }}>
                      Chat Now
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.card_title}>Your Journal</Text>
              <View style={{ paddingTop: 10 }}>
                <Journal />
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>

      {userData?.active_session && (
        <Animated.View
          style={{
            position: "absolute",
            bottom: 80,
            width: "100%",
            paddingHorizontal: 40,
            transform: [{ translateY: continueConvoTranslateY }],
          }}
        >
          <Pressable
            onPress={() => {
              navigation.navigate("Chat");
            }}
            style={{
              borderRadius: 20,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "rgba(30, 30, 150, 0.3)",
            }}
          >
            <BlurView
              intensity={80}
              tint="light"
              style={{
                padding: 15,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ width: "20%" }}>
                <TherapistImage
                  therapist={therapists.find(
                    (therapist) => therapist.name === userData.therapist
                  )}
                />
              </View>
              <View style={{ paddingLeft: 15, flexDirection: "column" }}>
                <Text style={{ fontWeight: "500", fontSize: 16 }}>
                  Continue Conversation?
                </Text>
                <Text style={{ paddingTop: 10 }}>
                  From{" "}
                  {moment
                    .utc(userData.active_session.start_time)
                    .local()
                    .fromNow()}
                </Text>
              </View>
            </BlurView>
          </Pressable>
        </Animated.View>
      )}

      {/** CUSTOM HEADER */}
      <Animated.View
        style={{
          position: "absolute",
          top: HEADER_MIN_HEIGHT - 20,
          left: 0,
          right: 0,

          paddingBottom: 20,
          paddingHorizontal: 20,
          backgroundColor: "#89CFF0",

          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-end",
          transform: [{ translateY: bigHeaderTranslateY }],
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.intro_line_1}>Hey {userData.first_name},</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Settings")}
          >
            <Ionicons name="ios-settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.intro_line_2}>Let's make today a good day</Text>
      </Animated.View>

      <Animated.View
        style={{
          height: smallHeaderHeight,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,

          paddingHorizontal: 20,
          paddingBottom: 10,

          backgroundColor: "#89CFF0",
          borderColor: "#2291C5",

          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          zIndex: 100,
        }}
      >
        <Animated.View
          style={{
            opacity: smallHeaderOpacity,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            Lorem
          </Text>
        </Animated.View>
      </Animated.View>

      {/** 
      <Animated.View style={headerStyle}>
        <AnimatedBlurView
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-end",
            paddingBottom: 20,
            paddingHorizontal: 20,
          }}
          intensity={blurIntensity} // You can adjust the intensity of the blur effect
          tint={"default"}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.intro_line_1}>Hey {userData.first_name},</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Settings")}
            >
              <Ionicons name="ios-settings-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.intro_line_2}>Let's make today a good day</Text>
        </AnimatedBlurView>
        <Animated.View style={separatorStyle} /> 
      </Animated.View>
          */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 25,
  },
  headerText: {
    marginTop: 50,
    fontSize: 20,
    textAlign: "center",
  },
  intro_container: {},
  intro_line_1: {
    fontSize: 40,
    fontWeight: "600",
    color: "white",
  },
  intro_line_2: {
    paddingTop: 5,
    fontSize: 20,
    fontWeight: "400",
    color: "white",
  },

  card: {
    backgroundColor: "#57A0E4",
    borderRadius: 10,
    padding: 20,
    marginBottom: 40,

    // iOS shadow properties
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,

    // Android elevation
    elevation: 5,
  },
  card_title: {
    fontSize: 20,
    fontWeight: "500",
    color: "white",
  },
});

export default HomeScreen;
